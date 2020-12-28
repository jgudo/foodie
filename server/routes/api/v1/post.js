const { isAuthenticated } = require('../../../middlewares/withAuth');
const { validateBody, schemas } = require('../../../validations/validations');
const Post = require('../../../schemas/PostSchema');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');

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

            const post = await Post
                .find(query)
                .sort(sortQuery)
                .populate('commentsCount')
                .populate({
                    path: 'author',
                    select: 'username fullname profilePicture'
                });

            if (!post || post.length === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No post(s) found.' }));
            }

            res.status(200).send(makeResponseJson(post));
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }
);

module.exports = router;
