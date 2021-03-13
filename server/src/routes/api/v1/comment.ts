import { COMMENTS_LIMIT } from '@/constants/constants';
import { filterWords, makeResponseJson } from '@/helpers/utils';
import { ErrorHandler, isAuthenticated, validateObjectID } from '@/middlewares';
import { Comment, Notification, Post } from '@/schemas';
import { schemas, validateBody } from '@/validations/validations';
import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';

const router = Router({ mergeParams: true });

router.post(
    '/v1/comment/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    validateBody(schemas.commentSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const { body } = req.body;
            const userID = req.user._id;

            // check if the POST actually exists
            const post = await Post.findById(post_id);
            if (!post) return next(new ErrorHandler(404, 'Unable to comment. Post not found.'));

            const comment = new Comment({
                _post_id: post_id,
                _author_id: userID,
                body: filterWords.clean(body),
                createdAt: Date.now()
            });

            await comment.save();
            await Post
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
                const notification = new Notification({
                    type: 'comment',
                    initiator: userID,
                    target: Types.ObjectId(post._author_id),
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

            res.status(200).send(makeResponseJson(comment));
        } catch (e) {
            console.log('CAN"T COMMENT', e)
            next(e);
        }
    }
);

router.get(
    '/v1/comment/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const skipParams = parseInt(req.query.skip as string);
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || COMMENTS_LIMIT;
            const skip = skipParams || offset * limit;

            const post = await Post.findById(Types.ObjectId(post_id));
            if (!post) return next(new ErrorHandler(404, 'No comments found.'));

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
                return next(new ErrorHandler(404, 'No comments found.'));
            }

            const commentsCount = commentsAgg[0].count || 0;
            const result = { comments, commentsCount };

            if (commentsCount === 0 || result.comments.length === 0) {
                return next(new ErrorHandler(404, 'No more comments.'));
            }

            console.log(result)
            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
);

router.delete(
    '/v1/comment/:comment_id',
    isAuthenticated,
    validateObjectID('comment_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { comment_id } = req.params;
            const userID = req.user._id.toString();
            const comment = await Comment.findById(comment_id);
            if (!comment) return next(new ErrorHandler(400, 'Comment not found.'));

            // FIND THE POST TO GET AUTHOR ID
            const post = await Post.findById(comment._post_id);
            const postAuthorID = post._author_id.toString();
            const commentAuthorID = comment._author_id.toString();

            // IF POST OWNER OR COMMENTOR - DELETE COMMENT
            if (userID === commentAuthorID || userID === postAuthorID) {
                await Comment.findByIdAndDelete(comment_id);
                await Post.findOneAndUpdate({
                    comments: {
                        $in: [comment_id]
                    }
                }, {
                    $pull: {
                        comments: Types.ObjectId(comment_id)
                    }
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
)

router.patch(
    '/v1/comment/:comment_id',
    isAuthenticated,
    validateObjectID('comment_id'),
    validateBody(schemas.commentSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { comment_id } = req.params;
            const { body } = req.body;
            const userID = req.user._id;
            if (!body) return res.sendStatus(400);

            const comment = await Comment.findById(comment_id);
            if (!comment) return next(new ErrorHandler(400, 'Comment not found.'));

            if (userID.toString() === comment._author_id.toString()) {
                const updatedComment = await Comment.findByIdAndUpdate(Types.ObjectId(comment_id), {
                    $set: {
                        body: filterWords.clean(body),
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
                    }).execPopulate()

                res.status(200).send(makeResponseJson(updatedComment));
            } else {
                return next(new ErrorHandler(401));
            }

        } catch (e) {
            next(e);
        }
    }
);

export default router;
