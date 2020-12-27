const { isValidObjectId } = require('mongoose');
const { isAuthenticated } = require('../../../middlewares/withAuth');
const Post = require('../../../schemas/PostSchema');
const Comment = require('../../../schemas/CommentSchema');
const { validateBody, schemas } = require('../../../validations/validations');
const { makeResponseJson } = require('../../../helpers/utils');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/comment/:post_id',
    isAuthenticated,
    validateBody(schemas.commentSchema),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;
            const { body } = req.body;

            if (!isValidObjectId(post_id) || !post_id) {
                return res.sendStatus(400);
            }

            const comment = new Comment({
                _post_id: post_id,
                _commented_by: req.user._id,
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

            res.status(200).send(makeResponseJson({
                ...comment.toObject(),
                _commented_by: req.user.toCommentJSON()
            }));
        } catch (e) {
            console.log('CAN"T COMMENT', e)
            res.status(401).send(e);
        }
    }
);

module.exports = router;
