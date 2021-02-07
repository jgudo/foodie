"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const CommentSchema_1 = __importDefault(require("../../../schemas/CommentSchema"));
const NotificationSchema_1 = __importDefault(require("../../../schemas/NotificationSchema"));
const PostSchema_1 = __importDefault(require("../../../schemas/PostSchema"));
const validations_1 = require("../../../validations/validations");
const router = require('express').Router({ mergeParams: true });
router.post('/v1/comment/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), validations_1.validateBody(validations_1.schemas.commentSchema), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { body } = req.body;
        const userID = req.user._id;
        // check if the POST actually exists
        const post = await PostSchema_1.default.findById(post_id);
        if (!post)
            return res.status(404).send(utils_1.makeErrorJson({ message: 'Unable to comment. Post not found.' }));
        const comment = new CommentSchema_1.default({
            _post_id: post_id,
            _author_id: userID,
            body,
            createdAt: Date.now()
        });
        await comment.save();
        await PostSchema_1.default
            .findByIdAndUpdate(post_id, {
            $push: {
                comments: comment._id
            }
        });
        await comment
            .populate({
            path: 'author',
            select: 'username profilePicture fullname'
        }).execPopulate();
        // SEND NOTIFICATION
        if (post._author_id.toString() !== userID.toString()) {
            const io = req.app.get('io');
            const notification = new NotificationSchema_1.default({
                type: 'comment',
                initiator: userID,
                target: mongoose_1.Types.ObjectId(post._author_id),
                link: `/post/${post_id}`,
                createdAt: Date.now()
            });
            notification
                .save()
                .then(async (doc) => {
                await doc
                    .populate({
                    path: 'target initiator',
                    select: 'fullname profilePicture username'
                })
                    .execPopulate();
                io.to(post._author_id.toString()).emit('newNotification', { notification: doc, count: 1 });
            });
        }
        res.status(200).send(utils_1.makeResponseJson(comment));
    }
    catch (e) {
        console.log('CAN"T COMMENT', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/comment/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const skipParams = parseInt(req.query.skip);
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || constants_1.COMMENTS_LIMIT;
        const skip = skipParams || offset * limit;
        const post = await PostSchema_1.default.findById(mongoose_1.Types.ObjectId(post_id));
        if (!post)
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'Unable to fetch comments.' }));
        const comments = await CommentSchema_1.default
            .find({ _post_id: post_id })
            .limit(limit)
            .populate({
            path: 'author',
            select: 'fullname username profilePicture'
        })
            .skip(skip)
            .sort({ createdAt: -1 });
        // res.status(200).send(comments)
        const commentsAgg = await CommentSchema_1.default.aggregate([
            {
                $match: {
                    _post_id: mongoose_1.Types.ObjectId(post_id)
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
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: null }));
        }
        const commentsCount = commentsAgg[0].count || 0;
        const result = { comments, commentsCount };
        if (commentsCount === 0 || result.comments.length === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'No more comments.' }));
        }
        console.log(result);
        res.status(200).send(utils_1.makeResponseJson(result));
    }
    catch (e) {
        console.log(e);
        res.status(500).send(utils_1.makeErrorJson({ status_code: 500, message: 'Something went wrong.' }));
    }
});
router.delete('/v1/comment/:comment_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('comment_id'), async (req, res, next) => {
    try {
        const { comment_id } = req.params;
        const userID = req.user._id.toString();
        const comment = await CommentSchema_1.default.findById(comment_id);
        if (!comment)
            return res.sendStatus(404);
        // FIND THE POST TO GET AUTHOR ID
        const post = await PostSchema_1.default.findById(comment._post_id);
        const postAuthorID = post._author_id.toString();
        const commentAuthorID = comment._author_id.toString();
        // IF POST OWNER OR COMMENTOR - DELETE COMMENT
        if (userID === commentAuthorID || userID === postAuthorID) {
            await CommentSchema_1.default.findByIdAndDelete(comment_id);
            await PostSchema_1.default.findOneAndUpdate({
                comments: {
                    $in: [comment_id]
                }
            }, {
                $pull: {
                    comments: mongoose_1.Types.ObjectId(comment_id)
                }
            });
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.patch('/v1/comment/:comment_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('comment_id'), validations_1.validateBody(validations_1.schemas.commentSchema), async (req, res, next) => {
    try {
        const { comment_id } = req.params;
        const { body } = req.body;
        const userID = req.user._id;
        if (!body)
            return res.sendStatus(400);
        const comment = await CommentSchema_1.default.findById(comment_id);
        if (!comment)
            return res.status(404).send(utils_1.makeErrorJson());
        if (userID.toString() === comment._author_id.toString()) {
            const updatedComment = await CommentSchema_1.default.findByIdAndUpdate(mongoose_1.Types.ObjectId(comment_id), {
                $set: {
                    body,
                    updatedAt: Date.now(),
                    isEdited: true
                }
            }, {
                new: true
            });
            await updatedComment
                .populate({
                path: 'author',
                select: 'fullname username profilePicture'
            }).execPopulate();
            res.status(200).send(utils_1.makeResponseJson(updatedComment));
        }
        else {
            res.status(500).send(utils_1.makeErrorJson());
        }
    }
    catch (e) {
    }
});
exports.default = router;
//# sourceMappingURL=comment.js.map