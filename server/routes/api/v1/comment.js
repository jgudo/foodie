const { isValidObjectId, Types } = require('mongoose');
const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const Post = require('../../../schemas/PostSchema');
const Comment = require('../../../schemas/CommentSchema');
const Notification = require('../../../schemas/NotificationSchema');
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
            if (post._author_id.toString() !== req.user._id.toString()) {
                const io = req.app.get('io');
                const notification = new Notification({
                    type: 'comment',
                    initiator: req.user._id,
                    target: Types.ObjectId(post._author_id),
                    link: `/post/${post_id}`,
                    createdAt: Date.now()
                });

                notification
                    .save()
                    .then(async (doc) => {
                        await doc.populate('target initiator', 'fullname profilePicture username').execPopulate();

                        io.to(post._author_id.toString()).emit('newNotification', { notification: doc, count: 1 });
                    });
            }

            res.status(200).send(makeResponseJson(comment));
        } catch (e) {
            console.log('CAN"T COMMENT', e)
            res.status(500).send(makeErrorJson());
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
            const skipParams = parseInt(req.query.skip);
            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const skip = skipParams || offset * limit;

            const post = await Post.findById(Types.ObjectId(post_id));
            if (!post) return res.status(404).send(makeErrorJson({ status_code: 404, message: 'Unable to fetch comments.' }));

            const comments = await Comment
                .find({ _post_id: post_id })
                .limit(limit)
                .populate({
                    path: 'author',
                    select: 'fullname username profilePicture'
                })
                .skip(skip)
                .sort({ createdAt: -1 })

            // res.status(200).send(comments)
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

            if (commentsCount === 0 || result.comments.length === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No more comments.' }))
            }

            console.log(result)
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

            // FIND THE POST TO GET AUTHOR ID
            const post = await Post.findById(comment._post_id);
            const postAuthorID = post._author_id.toString();
            const commentAuthorID = comment._author_id.toString();
            const userID = req.user._id.toString();

            // IF POST OWNER OR COMMENTOR - DELETE COMMENT
            if (userID === commentAuthorID || userID === postAuthorID) {
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
            res.status(500).send(makeErrorJson())
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
            if (!comment) return res.status(404).send(makeErrorJson());

            if (req.user._id.toString() === comment._author_id.toString()) {
                const updatedComment = await Comment.findByIdAndUpdate(comment_id, {
                    $set: {
                        body,
                        updatedAt: Date.now(),
                        isEdited: true
                    }
                }, {
                    new: true
                });

                await updatedComment.populate('author', 'fullname username profilePicture').execPopulate()

                res.status(200).send(makeResponseJson(updatedComment));
            } else {
                res.status(500).send(makeErrorJson());
            }

        } catch (e) {

        }
    }
);

module.exports = router;
