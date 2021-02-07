"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const BookmarkSchema_1 = __importDefault(require("../../../schemas/BookmarkSchema"));
const PostSchema_1 = __importDefault(require("../../../schemas/PostSchema"));
const UserSchema_1 = __importDefault(require("../../../schemas/UserSchema"));
const router = require('express').Router({ mergeParams: true });
router.post('/v1/bookmark/post/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const userID = req.user._id;
        const post = await PostSchema_1.default.findById(post_id);
        if (!post)
            return res.sendStatus(404);
        if (userID.toString() === post._author_id.toString()) {
            return res.status(401).send(utils_1.makeErrorJson({ status_code: 401, message: 'You can\'t bookmark your own post.' }));
        }
        const isPostBookmarked = await BookmarkSchema_1.default
            .findOne({
            _author_id: userID,
            _post_id: mongoose_1.Types.ObjectId(post_id)
        });
        if (isPostBookmarked) {
            await BookmarkSchema_1.default.findOneAndDelete({ _author_id: userID, _post_id: mongoose_1.Types.ObjectId(post_id) });
            await UserSchema_1.default.findByIdAndUpdate(userID, { $pull: { bookmarks: mongoose_1.Types.ObjectId(post_id) } });
            res.status(200).send(utils_1.makeResponseJson({ state: false }));
        }
        else {
            const bookmark = new BookmarkSchema_1.default({
                _post_id: post_id,
                _author_id: userID,
                createdAt: Date.now()
            });
            await bookmark.save();
            await UserSchema_1.default.findByIdAndUpdate(userID, { $push: { bookmarks: post_id } });
            res.status(200).send(utils_1.makeResponseJson({ state: true }));
        }
    }
    catch (e) {
        console.log('CANT BOOKMARK POST ', e);
        res.sendStatus(500);
    }
});
router.get('/v1/bookmarks', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const userID = req.user._id;
        const offset = parseInt(req.query.offset, 10) || 0;
        const limit = constants_1.BOOKMARKS_LIMIT;
        const skip = offset * limit;
        // GET TOTAL
        const countBookmarks = await BookmarkSchema_1.default.find({ _author_id: userID });
        const bookmarks = await BookmarkSchema_1.default
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
            return res.status(404).send(utils_1.makeErrorJson({ message: "You don't have any bookmarks." }));
        }
        const result = bookmarks.map((item) => {
            const isBookmarked = req.user.isBookmarked(item._post_id);
            return Object.assign(Object.assign({}, item.toObject()), { isBookmarked });
        });
        res.status(200).send(utils_1.makeResponseJson({ bookmarks: result, total: countBookmarks.length }));
    }
    catch (e) {
        console.log('CANT GET BOOKMARKS ', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
exports.default = router;
//# sourceMappingURL=bookmark.js.map