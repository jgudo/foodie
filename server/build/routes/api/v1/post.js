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
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const BookmarkSchema_1 = __importDefault(require("../../../schemas/BookmarkSchema"));
const CommentSchema_1 = __importDefault(require("../../../schemas/CommentSchema"));
const FollowSchema_1 = __importDefault(require("../../../schemas/FollowSchema"));
const NewsFeedSchema_1 = __importDefault(require("../../../schemas/NewsFeedSchema"));
const NotificationSchema_1 = __importStar(require("../../../schemas/NotificationSchema"));
const PostSchema_1 = __importStar(require("../../../schemas/PostSchema"));
const UserSchema_1 = __importDefault(require("../../../schemas/UserSchema"));
const filestorage_1 = require("../../../storage/filestorage");
const validations_1 = require("../../../validations/validations");
const router = require('express').Router({ mergeParams: true });
router.post('/v1/post', middlewares_1.isAuthenticated, filestorage_1.multer.array('photos', 5), validations_1.validateBody(validations_1.schemas.createPostSchema), async (req, res, next) => {
    try {
        const { description, privacy } = req.body;
        let photos = [];
        if (req.files) {
            const photosToSave = req.files.map((file) => filestorage_1.uploadImageToStorage(file));
            photos = await Promise.all(photosToSave);
            console.log(photos);
        }
        const post = new PostSchema_1.default({
            _author_id: req.user._id,
            // author: req.user._id,
            description,
            photos,
            privacy: privacy || 'public',
            createdAt: Date.now()
        });
        await post.save();
        await post
            .populate({
            path: 'author',
            select: 'profilePicture username fullname'
        })
            .execPopulate();
        const myFollowers = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
        const followers = !myFollowers ? [] : myFollowers.followers;
        let newsFeeds = [];
        // add post to follower's newsfeed
        if (myFollowers && myFollowers.followers) {
            newsFeeds = myFollowers.followers.map(follower => ({
                follower: mongoose_1.Types.ObjectId(follower._id),
                post: mongoose_1.Types.ObjectId(post._id),
                post_owner: req.user._id,
                createdAt: post.createdAt
            }));
        }
        // append own post on newsfeed
        newsFeeds = newsFeeds.concat({
            follower: req.user._id,
            post_owner: req.user._id,
            post: mongoose_1.Types.ObjectId(post._id),
            createdAt: post.createdAt
        });
        if (newsFeeds.length !== 0) {
            await NewsFeedSchema_1.default.insertMany(newsFeeds);
        }
        // Notify followers that new post has been made 
        const io = req.app.get('io');
        followers.forEach((user) => {
            io.to(user._id.toString()).emit('newFeed', Object.assign(Object.assign({}, post.toObject()), { isOwnPost: false }));
        });
        return res.status(200).send(utils_1.makeResponseJson(Object.assign(Object.assign({}, post.toObject()), { isOwnPost: true })));
    }
    catch (e) {
        console.log(e);
        return res.status(401).send(utils_1.makeErrorJson({ status_code: 401, message: 'You\'re not authorized to make a post.' }));
    }
});
router.get('/v1/:username/posts', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const { username } = req.params;
        const { sortBy, sortOrder } = req.query;
        const offset = parseInt(req.query.offset) || 0;
        const user = await UserSchema_1.default.findOne({ username });
        const myFollowing = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
        const following = (myFollowing && myFollowing.following) ? myFollowing.following : [];
        if (!user)
            return res.sendStatus(404);
        const limit = constants_1.POST_LIMIT;
        const skip = offset * limit;
        const query = {
            _author_id: user._id,
            privacy: { $in: [PostSchema_1.EPrivacy.public] },
        };
        const sortQuery = {
            [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1
        };
        if (username === req.user.username) {
            query.privacy.$in = [PostSchema_1.EPrivacy.public, PostSchema_1.EPrivacy.follower, PostSchema_1.EPrivacy.private];
        }
        else if (following.includes(user._id.toString())) {
            query.privacy.$in = [PostSchema_1.EPrivacy.public, PostSchema_1.EPrivacy.follower];
        }
        const posts = await PostSchema_1.default
            .find(query)
            .sort(sortQuery)
            .populate('commentsCount')
            .populate('likesCount')
            .populate({
            path: 'author',
            select: 'username fullname profilePicture',
        })
            .skip(skip)
            .limit(limit);
        if (posts.length <= 0 && offset === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: `${username} hasn't posted anything yet.` }));
        }
        else if (posts.length <= 0 && offset >= 1) {
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'No more posts.' }));
        }
        const uPosts = posts.map((post) => {
            const isPostLiked = post.isPostLiked(req.user._id);
            const isBookmarked = req.user.isBookmarked(post._id);
            const isOwnPost = post._author_id.toString() === req.user._id.toString();
            return Object.assign(Object.assign({}, post.toObject()), { isBookmarked,
                isOwnPost, isLiked: isPostLiked });
        });
        res.status(200).send(utils_1.makeResponseJson(uPosts));
    }
    catch (e) {
        console.log(e);
        res.status(400).send(utils_1.makeErrorJson());
    }
});
router.post('/v1/like/post/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const post = await PostSchema_1.default.findById(post_id);
        if (!post)
            return res.sendStatus(404); // SEND 404 IF NO POST FOUND
        const isPostLiked = post.isPostLiked(req.user._id);
        let query = {};
        if (isPostLiked) {
            query = {
                $pull: { likes: req.user._id }
            };
        }
        else {
            query = {
                $push: { likes: req.user._id }
            };
        }
        const fetchedPost = await PostSchema_1.default.findByIdAndUpdate(post_id, query, { new: true });
        await fetchedPost.populate('likesCount commentsCount').execPopulate();
        await fetchedPost
            .populate({
            path: 'author',
            select: 'fullname username profilePicture'
        })
            .execPopulate();
        const result = Object.assign(Object.assign({}, fetchedPost.toObject()), { isLiked: !isPostLiked });
        if (!isPostLiked && result.author.id !== req.user._id.toString()) {
            const io = req.app.get('io');
            const targetUserID = mongoose_1.Types.ObjectId(result.author.id);
            const newNotif = {
                type: NotificationSchema_1.ENotificationType.like,
                initiator: req.user._id,
                target: targetUserID,
                link: `/post/${post_id}`,
            };
            const notificationExists = await NotificationSchema_1.default.findOne(newNotif);
            if (!notificationExists) {
                const notification = new NotificationSchema_1.default(Object.assign(Object.assign({}, newNotif), { createdAt: Date.now() }));
                const doc = await notification.save();
                await doc
                    .populate({
                    path: 'target initiator',
                    select: 'fullname profilePicture username'
                })
                    .execPopulate();
                io.to(targetUserID).emit('newNotification', { notification: doc, count: 1 });
            }
            else {
                await NotificationSchema_1.default.findOneAndUpdate(newNotif, { $set: { createdAt: Date.now() } });
            }
        }
        res.status(200).send(utils_1.makeResponseJson({ post: result, state: isPostLiked }));
    }
    catch (e) {
        console.log(e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.patch('/v1/post/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), validations_1.validateBody(validations_1.schemas.createPostSchema), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { description, privacy } = req.body;
        const obj = { updatedAt: Date.now(), isEdited: true };
        if (!description && !privacy)
            return res.sendStatus(400);
        if (description)
            obj.description = description.trim();
        if (privacy)
            obj.privacy = privacy;
        const post = await PostSchema_1.default.findById(post_id);
        if (!post)
            return res.sendStatus(404);
        if (req.user._id.toString() === post._author_id.toString()) {
            const updatedPost = await PostSchema_1.default.findByIdAndUpdate(post_id, {
                $set: obj
            }, {
                new: true
            });
            await updatedPost
                .populate({
                path: 'author',
                select: 'fullname username profilePicture'
            })
                .execPopulate();
            res.status(200).send(utils_1.makeResponseJson(updatedPost));
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (e) {
        console.log('CANT EDIT POST :', e);
        res.sendStatus(500);
    }
});
// @route /post/:post_id -- DELETE POST
router.delete('/v1/post/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const post = await PostSchema_1.default.findById(post_id);
        if (!post)
            return res.sendStatus(404);
        if (req.user._id.toString() === post._author_id.toString()) {
            if (post.photos && post.photos.length !== 0)
                await filestorage_1.deleteImageFromStorage(...post.photos);
            await PostSchema_1.default.findByIdAndDelete(post_id);
            await CommentSchema_1.default.deleteMany({ _post_id: mongoose_1.Types.ObjectId(post_id) });
            await NewsFeedSchema_1.default.deleteMany({ post: mongoose_1.Types.ObjectId(post_id) });
            await BookmarkSchema_1.default.deleteMany({ _post_id: mongoose_1.Types.ObjectId(post_id) });
            await UserSchema_1.default.updateMany({
                bookmarks: {
                    $in: [post_id]
                }
            }, {
                $pull: {
                    bookmarks: mongoose_1.Types.ObjectId(post_id)
                }
            });
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (e) {
        console.log('CANT DELETE POST', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/post/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const post = await PostSchema_1.default.findById(post_id);
        if (!post) {
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'Post not found.' }));
        }
        if (post.privacy === 'private' && post._author_id.toString() !== req.user._id.toString()) {
            return res.status(401).send(utils_1.makeErrorJson({ status_code: 401, message: 'You\'re not authorized to view this' }));
        }
        await post
            .populate({
            path: 'author likesCount commentsCount',
            select: 'fullname username profilePicture'
        })
            .execPopulate();
        const isBookmarked = req.user.isBookmarked(post_id);
        const isPostLiked = post.isPostLiked(req.user._id);
        const isOwnPost = post._author_id.toString() === req.user._id.toString();
        const result = Object.assign(Object.assign({}, post.toObject()), { isLiked: isPostLiked, isBookmarked, isOwnPost });
        res.status(200).send(utils_1.makeResponseJson(result));
    }
    catch (e) {
        console.log('CANT GET POST', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/post/likes/:post_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('post_id'), async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const offset = parseInt(req.query.offset) || 0;
        const limit = constants_1.LIKES_LIMIT;
        const skip = offset * limit;
        const exist = await PostSchema_1.default.findById(mongoose_1.Types.ObjectId(post_id));
        if (!exist)
            return res.status(400).send(utils_1.makeErrorJson());
        const post = await PostSchema_1.default
            .findById(mongoose_1.Types.ObjectId(post_id))
            .populate({
            path: 'likes',
            select: 'profilePicture username fullname',
            options: {
                skip,
                limit,
            }
        });
        if (post.likes.length === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ message: 'No likes found.' }));
        }
        const myFollowing = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
        const following = (myFollowing && myFollowing.following) ? myFollowing.following : [];
        const result = post.likes.map((user) => {
            return Object.assign(Object.assign({}, user.toObject()), { isFollowing: following.includes(user.id) });
        });
        res.status(200).send(utils_1.makeResponseJson(result));
    }
    catch (e) {
        console.log('CANT GET POST LIKERS', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
exports.default = router;
//# sourceMappingURL=post.js.map