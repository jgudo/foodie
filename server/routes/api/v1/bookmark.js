const Bookmark = require('../../../schemas/BookmarkSchema');
const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const Post = require('../../../schemas/PostSchema');
const User = require('../../../schemas/UserSchema');
const { Types } = require('mongoose');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/bookmark/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);
            if (!post) return res.sendStatus(404);

            if (req.user._id.toString() === post._author_id.toString()) {
                return res.status(401).send(makeErrorJson({ status_code: 401, message: 'You can\'t bookmark your own post.' }))
            }

            const isPostBookmarked = await Bookmark
                .findOne({
                    _author_id: req.user._id,
                    _post_id: Types.ObjectId(post_id)
                });

            if (isPostBookmarked) {
                await Bookmark.findOneAndDelete({ _author_id: req.user._id, _post_id: Types.ObjectId(post_id) });
                await User.findByIdAndUpdate(req.user._id, { $pull: { bookmarks: post_id } });
                res.status(200).send(makeResponseJson({ state: false }));
            } else {
                const bookmark = new Bookmark({
                    _post_id: post_id,
                    _author_id: req.user._id,
                    createdAt: Date.now()
                });
                await bookmark.save();
                await User.findByIdAndUpdate(req.user._id, { $push: { bookmarks: post_id } });
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
    async (req, res, next) => {
        try {
            const offset = parseInt(req.query.offset) || 0;
            const limit = 15;
            const skip = offset * limit;

            // GET TOTAL
            const countBookmarks = await Bookmark.find({ _author_id: req.user._id });
            const bookmarks = await Bookmark
                .find({ _author_id: req.user._id })
                .populate({
                    path: 'post',
                    select: 'photos, description',
                    populate: {
                        path: 'likesCount commentsCount'
                    }
                })
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 });

            if (bookmarks.length === 0) {
                return res.status(200).send(makeResponseJson([]));
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

module.exports = router;
