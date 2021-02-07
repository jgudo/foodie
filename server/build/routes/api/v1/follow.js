"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const FollowSchema_1 = __importDefault(require("../../../schemas/FollowSchema"));
const NewsFeedSchema_1 = __importDefault(require("../../../schemas/NewsFeedSchema"));
const NotificationSchema_1 = __importDefault(require("../../../schemas/NotificationSchema"));
const PostSchema_1 = __importDefault(require("../../../schemas/PostSchema"));
const UserSchema_1 = __importDefault(require("../../../schemas/UserSchema"));
const router = require('express').Router({ mergeParams: true });
router.post('/v1/follow/:follow_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('follow_id'), async (req, res, next) => {
    try {
        const { follow_id } = req.params;
        const user = UserSchema_1.default.findById(follow_id);
        if (!user)
            return res.sendStatus(404); // CHECK IF FOLLOWING USER EXIST
        if (follow_id === req.user._id.toString())
            return res.sendStatus(400); // CHECK IF FOLLOWING IS NOT YOURSELF
        //  CHECK IF ALREADY FOLLOWING
        const isFollowing = await FollowSchema_1.default
            .findOne({
            _user_id: req.user._id,
            following: {
                $in: [mongoose_1.Types.ObjectId(follow_id)]
            }
        });
        if (isFollowing)
            return res.status(400).send(utils_1.makeErrorJson({ status_code: 400, message: 'Already following.' }));
        const bulk = FollowSchema_1.default.collection.initializeUnorderedBulkOp();
        bulk.find({ _user_id: req.user._id }).upsert().updateOne({
            $addToSet: {
                following: mongoose_1.Types.ObjectId(follow_id),
            }
        });
        bulk.find({ _user_id: mongoose_1.Types.ObjectId(follow_id) }).upsert().updateOne({
            $addToSet: {
                followers: req.user._id,
            }
        });
        await bulk.execute();
        // TODO ---- FILTER OUT DUPLICATES
        const io = req.app.get('io');
        const notification = new NotificationSchema_1.default({
            type: 'follow',
            initiator: req.user._id,
            target: mongoose_1.Types.ObjectId(follow_id),
            link: `/user/${req.user.username}`,
            createdAt: Date.now()
        });
        notification
            .save()
            .then(async (doc) => {
            await doc
                .populate({
                path: 'target initiator',
                select: 'fullname profilePicture username'
            }).execPopulate();
            io.to(follow_id).emit('newNotification', { notification: doc, count: 1 });
        });
        // SUBSCRIBE TO USER'S FEED
        const subscribeToUserFeed = await PostSchema_1.default
            .find({ _author_id: mongoose_1.Types.ObjectId(follow_id) })
            .sort({ createdAt: -1 })
            .limit(10);
        if (subscribeToUserFeed.length !== 0) {
            const feeds = subscribeToUserFeed.map((post) => {
                return {
                    follower: req.user._id,
                    post: post._id,
                    post_owner: post._author_id,
                    createdAt: post.createdAt
                };
            });
            await NewsFeedSchema_1.default.insertMany(feeds);
        }
        res.status(200).send(utils_1.makeResponseJson({ state: true }));
    }
    catch (e) {
        console.log('CANT FOLLOW USER, ', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.post('/v1/unfollow/:follow_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('follow_id'), async (req, res, next) => {
    try {
        const { follow_id } = req.params;
        const user = UserSchema_1.default.findById(follow_id);
        if (!user)
            return res.sendStatus(404);
        if (follow_id === req.user._id.toString())
            return res.sendStatus(400);
        const bulk = FollowSchema_1.default.collection.initializeUnorderedBulkOp();
        bulk.find({ _user_id: req.user._id }).upsert().updateOne({
            $pull: {
                following: mongoose_1.Types.ObjectId(follow_id)
            }
        });
        bulk.find({ _user_id: mongoose_1.Types.ObjectId(follow_id) }).upsert().updateOne({
            $pull: {
                followers: req.user._id
            }
        });
        bulk.execute(function (err, doc) {
            if (err) {
                return res.status(200).send(utils_1.makeResponseJson({ state: false }));
            }
            // UNSUBSCRIBE TO PERSON'S FEED
            NewsFeedSchema_1.default
                .deleteMany({
                post_owner: mongoose_1.Types.ObjectId(follow_id),
                follower: req.user._id
            })
                .then(() => {
                console.log('UNSUBSCRIBED TO USER SUCCESSFUL.');
            });
            res.status(200).send(utils_1.makeResponseJson({ state: false }));
        });
    }
    catch (e) {
        console.log('CANT FOLLOW USER, ', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/:username/following', middlewares_1.isAuthenticated, async (req, res) => {
    try {
        const { username } = req.params;
        const offset = parseInt(req.query.offset) || 0;
        const limit = constants_1.USERS_LIMIT;
        const skip = offset * limit;
        // TODO ---------- TEST LIMIT AND SKIP
        const follow = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
        const myFollowing = follow ? follow.following : [];
        const user = await UserSchema_1.default.findOne({ username });
        if (!user)
            return res.sendStatus(404);
        console.log(myFollowing);
        const doc = await FollowSchema_1.default.aggregate([
            {
                $match: {
                    _user_id: mongoose_1.Types.ObjectId(user._id)
                }
            },
            { $unwind: '$following' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'following',
                    foreignField: '_id',
                    as: 'userFollowing',
                }
            },
            { $unwind: '$userFollowing' },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    user: {
                        id: '$userFollowing._id',
                        username: '$userFollowing.username',
                        profilePicture: '$userFollowing.profilePicture',
                        email: '$userFollowing.email',
                        fullname: '$userFollowing.fullname'
                    }
                }
            },
            {
                $addFields: {
                    isFollowing: {
                        $in: ['$user.id', myFollowing]
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    following: { $push: { user: '$user', isFollowing: '$isFollowing' } }
                }
            },
            {
                $project: {
                    _id: 0,
                    _user_id: 1,
                    following: 1,
                }
            }
        ]);
        const { following } = doc[0] || {};
        const finalResult = following ? following : [];
        if (finalResult.length === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ message: `${username} isn't following anyone.` }));
        }
        res.status(200).send(utils_1.makeResponseJson(finalResult));
    }
    catch (e) {
    }
});
router.get('/v1/:username/followers', middlewares_1.isAuthenticated, async (req, res) => {
    try {
        const { username } = req.params;
        const offset = parseInt(req.query.offset) || 0;
        const limit = constants_1.USERS_LIMIT;
        const skip = offset * limit;
        const follow = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
        const selfFollowing = follow ? follow.following : [];
        const user = await UserSchema_1.default.findOne({ username });
        if (!user)
            return res.sendStatus(404);
        const doc = await FollowSchema_1.default.aggregate([
            {
                $match: {
                    _user_id: mongoose_1.Types.ObjectId(user._id)
                }
            },
            { $unwind: '$followers' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'followers',
                    foreignField: '_id',
                    as: 'userFollowers'
                }
            },
            { $unwind: '$userFollowers' },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    user: {
                        id: '$userFollowers._id',
                        username: '$userFollowers.username',
                        profilePicture: '$userFollowers.profilePicture',
                        email: '$userFollowers.email',
                        fullname: '$userFollowers.fullname'
                    }
                }
            },
            {
                $addFields: {
                    isFollowing: {
                        $in: ['$user.id', selfFollowing]
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    followers: { $push: { user: '$user', isFollowing: '$isFollowing' } }
                }
            },
            {
                $project: {
                    _user_id: 1,
                    followers: 1
                }
            },
        ]);
        const { followers } = doc[0] || {};
        const finalResult = followers ? followers : [];
        if (finalResult.length === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ message: `${username} has no followers.` }));
        }
        res.status(200).send(utils_1.makeResponseJson(finalResult));
    }
    catch (e) {
        console.log('CANT GET FOLLOWERS', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/people/suggested', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const offset = parseInt(req.query.offset) || 0;
        const skipParam = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || constants_1.USERS_LIMIT;
        const skip = skipParam || offset * limit;
        const myFollowing = await FollowSchema_1.default.findOne({ _user_id: req.user._id });
        let following = [];
        if (myFollowing)
            following = myFollowing.following;
        console.log(limit);
        const people = await UserSchema_1.default.aggregate([
            {
                $match: {
                    _id: {
                        $nin: [...following, req.user._id]
                    }
                }
            },
            ...(limit < 10 ? ([{ $sample: { size: limit } }]) : []),
            { $skip: skip },
            { $limit: limit },
            {
                $addFields: {
                    isFollowing: false
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    username: '$username',
                    profilePicture: '$profilePicture',
                    isFollowing: 1
                }
            }
        ]);
        if (people.length === 0)
            return res.status(404).send(utils_1.makeErrorJson({ message: 'No suggested people.' }));
        // I want my own account to be on top :) 
        // Just remove this xD
        if (limit < 10) { // If less than 10, I want to only append mine in Home page Suggested people list
            const julius = await UserSchema_1.default.findOne({ username: 'jgudo' });
            if (julius) {
                people.unshift(Object.assign(Object.assign({}, utils_1.sessionizeUser(julius)), { isFollowing: following.includes(julius._id.toString()) }));
            }
        }
        // ---
        res.status(200).send(utils_1.makeResponseJson(people));
    }
    catch (e) {
        console.log('CANT GET SUGGESTED PEOPLE', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
exports.default = router;
//# sourceMappingURL=follow.js.map