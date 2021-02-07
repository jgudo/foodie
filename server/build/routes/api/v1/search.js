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
const lodash_omit_1 = __importDefault(require("lodash.omit"));
const utils_1 = require("../../../helpers/utils");
const FollowSchema_1 = __importDefault(require("../../../schemas/FollowSchema"));
const PostSchema_1 = __importStar(require("../../../schemas/PostSchema"));
const UserSchema_1 = __importDefault(require("../../../schemas/UserSchema"));
const router = require('express').Router({ mergeParams: true });
router.get('/v1/search', async (req, res, next) => {
    try {
        const { q, type } = req.query;
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = offset * limit;
        if (!q)
            return res.status(400).send(utils_1.makeErrorJson());
        let result = [];
        if (type === 'posts') {
            const posts = await PostSchema_1.default
                .find({
                description: {
                    $regex: q,
                    $options: 'i'
                },
                privacy: PostSchema_1.EPrivacy.public
            })
                .populate('likesCount commentsCount')
                .populate('author', 'profilePicture fullname username')
                .limit(limit)
                .skip(skip);
            if (posts.length === 0) {
                return res.status(404).send(utils_1.makeErrorJson({ message: 'No posts found.' }));
            }
            const postsMerged = posts.map((post) => {
                const isPostLiked = post.isPostLiked(req.user._id);
                const isBookmarked = req.user.isBookmarked(post.id);
                return Object.assign(Object.assign({}, post.toObject()), { isLiked: isPostLiked, isBookmarked });
            });
            result = postsMerged;
            // console.log(posts);
        }
        else {
            let following = [];
            const users = await UserSchema_1.default
                .find({
                $or: [
                    { firstname: { $regex: q, $options: 'i' } },
                    { lastname: { $regex: q, $options: 'i' } },
                    { username: { $regex: q, $options: 'i' } }
                ]
            })
                .limit(limit)
                .skip(skip);
            if (users.length === 0) {
                return res.status(404).send(utils_1.makeErrorJson({ message: 'No users found.' }));
            }
            if (req.isAuthenticated()) {
                const myFollowing = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
                following = !myFollowing ? [] : myFollowing.following;
                const usersMerged = users.map((user) => {
                    return Object.assign(Object.assign({}, lodash_omit_1.default(user.toUserJSON(), 'bookmarks')), { isFollowing: following.includes(user.id) });
                });
                result = usersMerged;
            }
            else {
                result = users;
            }
        }
        res.status(200).send(utils_1.makeResponseJson(result));
    }
    catch (e) {
        console.log('CANT PERFORM SEARCH: ', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map