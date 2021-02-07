import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { BOOKMARKS_LIMIT } from '../../../constants/constants';
import { makeErrorJson, makeResponseJson } from '../../../helpers/utils';
import { isAuthenticated, validateObjectID } from '../../../middlewares/middlewares';
import Bookmark from '../../../schemas/BookmarkSchema';
import Post from '../../../schemas/PostSchema';
import User from '../../../schemas/UserSchema';

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/bookmark/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const userID = req.user._id;

            const post = await Post.findById(post_id);
            if (!post) return res.sendStatus(404);

            if (userID.toString() === post._author_id.toString()) {
                return res.status(401).send(makeErrorJson({ status_code: 401, message: 'You can\'t bookmark your own post.' }))
            }

            const isPostBookmarked = await Bookmark
                .findOne({
                    _author_id: userID,
                    _post_id: Types.ObjectId(post_id)
                });

            if (isPostBookmarked) {
                await Bookmark.findOneAndDelete({ _author_id: userID, _post_id: Types.ObjectId(post_id) });
                await User.findByIdAndUpdate(userID, { $pull: { bookmarks: Types.ObjectId(post_id) } });
                res.status(200).send(makeResponseJson({ state: false }));
            } else {
                const bookmark = new Bookmark({
                    _post_id: post_id,
                    _author_id: userID,
                    createdAt: Date.now()
                });
                await bookmark.save();
                await User.findByIdAndUpdate(userID, { $push: { bookmarks: post_id } });
                res.status(200).send(makeResponseJson({ state: true }));
            }
        } catch (e) {
            console.log('CANT BOOKMARK POST ', e);
            res.sendStatus(500);
        }
    }
);

router.get(
    '/v1/bookmarks',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userID = req.user._id;
            const offset = parseInt((req.query.offset as string), 10) || 0;
            const limit = BOOKMARKS_LIMIT;
            const skip = offset * limit;

            // GET TOTAL
            const countBookmarks = await Bookmark.find({ _author_id: userID });
            const bookmarks = await Bookmark
                .find({ _author_id: userID })
                .populate({
                    path: 'post',
                    select: 'photos description',
                    populate: {
                        path: 'likesCount commentsCount'
                    }
                })
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 });

            if (bookmarks.length === 0) {
                return res.status(404).send(makeErrorJson({ message: "You don't have any bookmarks." }));
            }

            const result = bookmarks.map((item) => {
                const isBookmarked = req.user.isBookmarked(item._post_id);

                return {
                    ...item.toObject(),
                    isBookmarked,
                }
            });

            res.status(200).send(makeResponseJson({ bookmarks: result, total: countBookmarks.length }));
        } catch (e) {
            console.log('CANT GET BOOKMARKS ', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

export default router;
