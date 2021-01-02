const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const { validateBody, schemas } = require('../../../validations/validations');
const Post = require('../../../schemas/PostSchema');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');
const { isValidObjectId, Types } = require('mongoose');
const Follow = require('../../../schemas/FollowSchema');
const NewsFeed = require('../../../schemas/NewsFeedSchema');

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
            const userFollowers = await Follow.findOne({ _user_id: req.user._id });
            let newsFeeds = [];

            if (userFollowers && userFollowers.followers) {
                newsFeeds = userFollowers.followers.map(follower => ({
                    follower: Types.ObjectId(follower._id),
                    post: Types.ObjectId(post._id)
                }));
            }

            if (newsFeeds.length !== 0) {
                await NewsFeed.insertMany(newsFeeds);
            }

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
            const { privacy, sortBy, sortOrder, offset: off } = req.query;

            let offset = 0;
            if (typeof off !== undefined && !isNaN(off)) offset = parseInt(off);

            const limit = 5;
            const skip = offset * limit;

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
                    select: 'username fullname profilePicture',
                })
                .skip(skip)
                .limit(limit);

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


module.exports = router;
