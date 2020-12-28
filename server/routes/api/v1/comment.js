const { isValidObjectId } = require('mongoose');
const { isAuthenticated } = require('../../../middlewares/withAuth');
const Post = require('../../../schemas/PostSchema');
const Comment = require('../../../schemas/CommentSchema');
const { validateBody, schemas } = require('../../../validations/validations');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/comment/:post_id',
    isAuthenticated,
    validateBody(schemas.commentSchema),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;
            const { body } = req.body;

            // check is POST ID is a valid Object ID
            if (!isValidObjectId(post_id) || !post_id) {
                return res.sendStatus(400);
            }

            // check if the POST actually exists
            const post = await Post.findById(post_id);
            if (!post) return res.status(404).send(makeErrorJson({ message: 'Unable to comment. Post not found.' }))

            const comment = new Comment({
                _post_id: post_id,
                _commentor_id: req.user._id,
                body,
                createdAt: Date.now()
            });

            await comment.save();
            await Post
                .findByIdAndUpdate(post_id, {
                    $push: {
                        comments: comment._id
                    }
                });
            await comment.populate('commentor', 'username profilePicture fullname').execPopulate();

            res.status(200).send(makeResponseJson(comment));
        } catch (e) {
            console.log('CAN"T COMMENT', e)
            res.status(401).send(e);
        }
    }
);

module.exports = router;
