const { isValidObjectId, Types } = require('mongoose');
const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const Post = require('../../../schemas/PostSchema');
const Comment = require('../../../schemas/CommentSchema');
const { validateBody, schemas } = require('../../../validations/validations');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/comment/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    validateBody(schemas.commentSchema),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;
            const { body } = req.body;

            // check if the POST actually exists
            const post = await Post.findById(post_id);
            if (!post) return res.status(404).send(makeErrorJson({ message: 'Unable to comment. Post not found.' }))

            const comment = new Comment({
                _post_id: post_id,
                _author_id: req.user._id,
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
            await comment.populate('author', 'username profilePicture fullname').execPopulate();

            // SEND NOTIFICATION
            const io = req.app.get('io');
            const notification = new Notification({
                type: 'comment',
                initiator: req.user._id,
                target: Types.ObjectId(post._author_id),
                link: `/posts/${post_id}`,
                createdAt: Date.now()
            });

            notification
                .save()
                .then(async (doc) => {
                    await doc.populate('target initiator', 'fullname profilePicture username').execPopulate();

                    io.to(follow_id).emit('notifyComment', { notification: doc, count: 1 });
                });

            res.status(200).send(makeResponseJson(comment));
        } catch (e) {
            console.log('CAN"T COMMENT', e)
            res.status(401).send(e);
        }
    }
);

router.get(
    '/v1/comment/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;
            const { offset: off } = req.query;
            let offset = 0;
            if (typeof off !== undefined && !isNaN(off)) offset = parseInt(off);

            const limit = 10;
            const skip = offset * limit;

            const post = await Post.findById(Types.ObjectId(post_id));
            if (!post) return res.status(404).send(makeErrorJson({ status_code: 404, message: 'Unable to fetch comments.' }));

            const comments = await Comment
                .find({ _post_id: post_id })
                .populate({
                    path: 'author',
                    select: 'fullname username profilePicture'
                })
                .skip(skip)
                .limit(limit);

            const commentsAgg = await Comment.aggregate([
                {
                    $match: {
                        _post_id: Types.ObjectId(post_id)
                    }
                },
                {
                    $group: {
                        _id: '$_post_id',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);

            if (commentsAgg.length === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: null }))
            }

            const commentsCount = commentsAgg[0].count || 0;
            const result = { comments, commentsCount };

            if (commentsCount === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No more comments.' }))
            }

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log(e);
            res.status(500).send(makeErrorJson({ status_code: 500, message: 'Something went wrong.' }));
        }
    }
);

router.delete(
    '/v1/comment/:comment_id',
    isAuthenticated,
    validateObjectID('comment_id'),
    async (req, res, next) => {
        try {
            const { comment_id } = req.params;

            const comment = await Comment.findById(comment_id);
            if (!comment) return res.sendStatus(404);

            // IF POST OWNER OR COMMENTOR - DELETE COMMENT
            if (req.user._id.toString() === comment._author_id.toString()) {
                await Comment.findByIdAndDelete(comment_id);
                await Post.findOneAndUpdate({
                    comments: {
                        $in: [comment_id]
                    }
                }, {
                    $pull: {
                        comments: comment_id
                    }
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    }
)

router.patch(
    '/v1/comment/:comment_id',
    isAuthenticated,
    validateObjectID('comment_id'),
    validateBody(schemas.commentSchema),
    async (req, res, next) => {
        try {
            const { comment_id } = req.params;
            const { body } = req.body;

            if (!body) return res.sendStatus(400);

            const comment = await Comment.findById(comment_id);
            if (!comment) return res.sendStatus(404);

            if (req.user._id.toString() === comment._author_id.toString()) {
                const updatedComment = await Comment.findByIdAndUpdate(comment_id, {
                    $set: {
                        body,
                        updatedAt: Date.now()
                    }
                }, {
                    new: true
                });

                await updatedComment.populate('author', 'fullname username profilePicture').execPopulate()

                res.status(200).send(makeResponseJson(updatedComment));
            } else {
                res.sendStatus(401);
            }

        } catch (e) {

        }
    }
);

module.exports = router;
