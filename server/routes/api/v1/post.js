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
            const { _posted_by, description } = req.body;
            const post = new Post({ _posted_by: req.user._id, description, createdAt: Date.now() });

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

module.exports = router;
