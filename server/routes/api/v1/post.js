const { isAuthenticated } = require('../../../middlewares/withAuth');
const { validateBody, schemas } = require('../../../validations/validations');
const Post = require('../../../schemas/PostSchema');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');
const { isValidObjectId } = require('mongoose');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/create-post',
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

                return {
                    ...post.toObject(),
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
    async (req, res, next) => {
        try {
            const { post_id } = req.params;

            if (!isValidObjectId(post_id) || !post_id) return res.sendStatus(400);

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

            console.log(req.user.toObject())
            const fetchedPost = await Post.findOneAndUpdate({ _id: post_id }, query, { new: true });
            await fetchedPost.populate('author', 'fullname username profilePicture').execPopulate();
            const updatedPost = { ...fetchedPost.toObject(), isLiked: !isPostLiked };

            res.status(200).send(makeResponseJson(updatedPost));
        } catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    }
);

module.exports = router;
