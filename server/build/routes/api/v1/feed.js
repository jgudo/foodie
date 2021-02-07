"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const NewsFeedSchema_1 = __importDefault(require("../../../schemas/NewsFeedSchema"));
const PostSchema_1 = __importStar(require("../../../schemas/PostSchema"));
const router = require('express').Router({ mergeParams: true });
router.get('/v1/feed', async (req, res, next) => {
    try {
        const offset = parseInt(req.query.offset, 10) || 0;
        const limit = constants_1.FEED_LIMIT;
        const skip = offset * limit;
        let result = [];
        if (req.isAuthenticated()) {
            const feeds = await NewsFeedSchema_1.default
                .find({ follower: req.user._id })
                .sort({ createdAt: -1 })
                .populate({
                path: 'post',
                populate: {
                    path: 'author likesCount commentsCount',
                    select: 'profilePicture username fullname',
                },
            })
                .limit(limit)
                .skip(skip);
            const filteredFeed = feeds
                .filter(feed => {
                if (feed.post) {
                    return feed.post.privacy === 'follower' || feed.post.privacy === 'public';
                }
            }) // filter out null posts (users that have been deleted but posts still in db)
                .map((feed) => {
                const isPostLiked = feed.post.isPostLiked(req.user._id);
                const isBookmarked = req.user.isBookmarked(feed.post.id);
                const isOwnPost = feed.post._author_id.toString() === req.user._id.toString();
                return Object.assign(Object.assign({}, feed.post.toObject()), { isLiked: isPostLiked, isBookmarked, isOwnPost });
            });
            if (filteredFeed.length === 0) {
                return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'No more feed.' }));
            }
            result = filteredFeed;
        }
        else {
            const feeds = await PostSchema_1.default
                .find({ privacy: PostSchema_1.EPrivacy.public })
                .sort({ createdAt: -1 })
                .populate({
                path: 'author likesCount commentsCount',
                select: 'profilePicture username fullname',
            })
                .limit(limit)
                .skip(skip);
            if (feeds.length === 0) {
                return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'No more feed.' }));
            }
            result = feeds;
        }
        res.status(200).send(utils_1.makeResponseJson(result));
    }
    catch (e) {
        console.log('CANT GET FEED', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
exports.default = router;
//# sourceMappingURL=feed.js.map