const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const { validateBody, schemas } = require('../../../validations/validations');
const Post = require('../../../schemas/PostSchema');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');
const { isValidObjectId } = require('mongoose');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/post',
    isAuthenticated,
    validateBody(schemas.createPostSchema),
    async (req, res, next) => {
        try {
            const { description, privacy } = req.body;
            const post = new Post({
                _author_id: req.user._id,
                // author: req.user._id,
                post_owner: req.user.username,
                description,
                privacy: privacy || 'public',
                createdAt: Date.now()
            });

            await post.save();
            await User
                .findByIdAndUpdate(req.user._id, {
                    $push: {
                        posts: post._id
                    }
                });

            console.log('FROM /create-post:', req.isAuthenticated())
            return res.status(200).send(makeResponseJson(post));
        } catch (e) {
            console.log(e);
            return res.status(401).send(makeErrorJson({ status_code: 401, message: 'You\'re not authorized to make a post.' }))
        }
    });

router.get(
    '/v1/:username/posts',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const { privacy, sortBy, sortOrder } = req.query;
            const query = {
                post_owner: username,
                privacy: { $in: ['public'] },
            };
            const sortQuery = {
                [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1
            };

            if (username === req.user.username && privacy) {
                query.privacy.$in = ['public', privacy];
            }

            const posts = await Post
                .find(query)
                .sort(sortQuery)
                .populate('commentsCount')
                .populate({
                    path: 'author',
                    select: 'username fullname profilePicture'
                });

            const uPosts = posts.map((post) => { // POST WITH isLiked merged
                const isPostLiked = post.isPostLiked(req.user._id);
                const isBookmarked = req.user.isBookmarked(post._id);

                return {
                    ...post.toObject(),
                    isBookmarked,
                    isLiked: isPostLiked
                }
            });

            if (!uPosts || uPosts.length === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No post(s) found.' }));
            }

            res.status(200).send(makeResponseJson(uPosts));
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }
);

router.post(
    '/v1/like/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);

            if (!post) return res.sendStatus(404); // SEND 404 IF NO POST FOUND

            const isPostLiked = post.isPostLiked(req.user._id);
            let query = {};

            if (isPostLiked) {
                query = {
                    $pull: { likes: req.user._id }
                }
            } else {
                query = {
                    $push: { likes: req.user._id }
                }
            }

            const fetchedPost = await Post.findByIdAndUpdate(post_id, query, { new: true });
            await fetchedPost.populate('author', 'fullname username profilePicture').execPopulate();
            const updatedPost = { ...fetchedPost.toObject(), isLiked: !isPostLiked };

            res.status(200).send(makeResponseJson(updatedPost));
        } catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    }
);

router.patch(
    '/v1/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    validateBody(schemas.createPostSchema),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;
            const { description, privacy } = req.body;
            const obj = { updatedAt: Date.now() };

            if (!description && !privacy) return res.sendStatus(400);

            if (description) obj.description = description;
            if (privacy && (privacy === 'public' || privacy === 'private')) obj.privacy = privacy;

            const post = await Post.findById(post_id);
            if (!post) return res.sendStatus(404);

            if (req.user._id.toString() === post._author_id.toString()) {
                const updatedPost = await Post.findByIdAndUpdate(post_id, {
                    $set: obj
                }, {
                    new: true
                });
                await updatedPost.populate('author', 'fullname, username, profilePicture').execPopulate();

                res.status(200).send(makeResponseJson(updatedPost));
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.log('CANT EDIT POST :', e);
            res.sendStatus(500);
        }
    }
);
// @route /post/:post_id -- DELETE POST
router.delete(
    '/v1/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);
            if (!post) return res.sendStatus(404);

            if (req.user._id.toString() === post._author_id.toString()) {
                await Post.findByIdAndDelete(post_id);
                await User.updateMany({
                    bookmarks: {
                        $in: [post_id]
                    }
                }, {
                    $pull: {
                        bookmarks: post_id
                    }
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.log('CANT DELETE POST', e);
            res.sendStatus(500);
        }
    }
);

// @route /bookmark/post/:post_id -- BOOKMARK POST
router.post(
    '/v1/bookmark/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);
            if (!post) return res.sendStatus(404);

            if (req.user._id.toString() === post._author_id.toString()) {
                return res.status(401).send(makeErrorJson({ status_code: 401, message: 'You can\'t bookmark your own post.' }))
            }

            const isPostBookmarked = req.user.isBookmarked(post_id);
            let query = {};

            if (isPostBookmarked) {
                query = {
                    $pull: { bookmarks: post_id }
                }
            } else {
                query = {
                    $push: { bookmarks: post_id }
                }
            }

            await User.findByIdAndUpdate(req.user._id, query);
            await post.populate('author', 'fullname username profilePicture').execPopulate();

            const uPost = { ...post.toObject(), isBookmarked: !isPostBookmarked };
            res.status(200).send(makeResponseJson(uPost));
        } catch (e) {
            console.log('CANT BOOKMARK POST ', e);
            res.sendStatus(500);
        }
    }
);

module.exports = router;
