const { Types } = require('mongoose');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const { validateObjectID, isAuthenticated } = require('../../../middlewares/middlewares');
const Follow = require('../../../schemas/FollowSchema');
const User = require('../../../schemas/UserSchema');
const Notification = require('../../../schemas/NotificationSchema');
const NewsFeed = require('../../../schemas/NewsFeedSchema');
const Post = require('../../../schemas/PostSchema');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/follow/:follow_id',
    isAuthenticated,
    validateObjectID('follow_id'),
    async (req, res, next) => {
        try {
            const { follow_id } = req.params;

            const user = User.findById(follow_id);
            if (!user) return res.sendStatus(404); // CHECK IF FOLLOWING USER EXIST
            if (follow_id === req.user._id.toString()) return res.sendStatus(400); // CHECK IF FOLLOWING IS NOT YOURSELF

            //  CHECK IF ALREADY FOLLOWING
            const isFollowing = await Follow
                .findOne({
                    _user_id: req.user._id,
                    following: {
                        $in: [Types.ObjectId(follow_id)]
                    }
                });
            if (isFollowing) return res.status(400).send(makeErrorJson({ status_code: 400, message: 'Already following.' }));

            const bulk = Follow.collection.initializeUnorderedBulkOp();

            bulk.find({ _user_id: req.user._id }).upsert().updateOne({
                $addToSet: {
                    following: Types.ObjectId(follow_id),
                }
            });

            bulk.find({ _user_id: Types.ObjectId(follow_id) }).upsert().updateOne({
                $addToSet: {
                    followers: req.user._id,
                }
            });

            await bulk.execute();

            const io = req.app.get('io');
            const notification = new Notification({
                type: 'follow',
                initiator: req.user._id,
                target: Types.ObjectId(follow_id),
                link: `/user/${req.user.username}`,
                createdAt: Date.now()
            });

            notification
                .save()
                .then(async (doc) => {
                    await doc.populate('target initiator', 'fullname profilePicture username').execPopulate();

                    io.to(follow_id).emit('notifyFollow', { notification: doc, count: 1 });
                });

            // SUBSCRIBE TO USER'S FEED
            const subscribeToUserFeed = await Post
                .find({ _author_id: Types.ObjectId(follow_id) })
                .sort({ createdAt: -1 })
                .limit(10);

            if (subscribeToUserFeed.length !== 0) {
                const feeds = subscribeToUserFeed.map((post) => {
                    return {
                        follower: req.user._id,
                        post: post._id,
                        post_owner: post._author_id
                    }
                });

                await NewsFeed.insertMany(feeds);
            }
            res.status(200).send(makeResponseJson({ state: true }));
        } catch (e) {
            console.log('CANT FOLLOW USER, ', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

router.post(
    '/v1/unfollow/:follow_id',
    isAuthenticated,
    validateObjectID('follow_id'),
    async (req, res, next) => {
        try {
            const { follow_id } = req.params;

            const user = User.findById(follow_id);
            if (!user) return res.sendStatus(404);
            if (follow_id === req.user._id.toString()) return res.sendStatus(400);

            const bulk = Follow.collection.initializeUnorderedBulkOp();

            bulk.find({ _user_id: req.user._id }).upsert().updateOne({
                $pull: {
                    following: Types.ObjectId(follow_id)
                }
            });

            bulk.find({ _user_id: Types.ObjectId(follow_id) }).upsert().updateOne({
                $pull: {
                    followers: req.user._id
                }
            });

            bulk.execute(function (err, doc) {
                if (err) {
                    return res.status(200).send(makeResponseJson({ state: false }));
                }

                // UNSUBSCRIBE TO PERSON'S FEED
                NewsFeed
                    .deleteMany({
                        post_owner: Types.ObjectId(follow_id),
                        follower: req.user._id
                    })
                    .then(() => {
                        console.log('UNSUBSCRIBED TO USER SUCCESSFUL.')
                    });

                res.status(200).send(makeResponseJson({ state: false }));
            });
        } catch (e) {
            console.log('CANT FOLLOW USER, ', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

router.get(
    '/v1/:username/following',
    isAuthenticated,
    async (req, res) => {
        try {
            const { username } = req.params;

            const selfFollowing = await Follow.findOne({ _user_id: req.user._id });
            console.log('MY FOLLOWING: ', selfFollowing.following)
            const user = await User.findOne({ username });
            if (!user) return res.sendStatus(404);

            const doc = await Follow.aggregate([
                {
                    $match: {
                        _user_id: Types.ObjectId(user._id)
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
                {
                    $addFields: {
                        isFollowing: {
                            $in: ['$userFollowing._id', selfFollowing.following]
                        }
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        following: { $push: { user: '$userFollowing', isFollowing: '$isFollowing' } }
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
            res.status(200).send(makeResponseJson(finalResult));
        } catch (e) {

        }
    });

router.get(
    '/v1/:username/followers',
    isAuthenticated,
    async (req, res) => {
        try {
            const { username } = req.params;

            const selfFollowing = await Follow.findOne({ _user_id: req.user._id });
            const user = await User.findOne({ username });
            if (!user) return res.sendStatus(404);

            const doc = await Follow.aggregate([{
                $match: {
                    _user_id: Types.ObjectId(user._id)
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
            {
                $addFields: {
                    isFollowing: {
                        $in: ['$userFollowers._id', selfFollowing.following]
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    followers: { $push: { user: '$userFollowers', isFollowing: '$isFollowing' } }
                }
            },
            {
                $project: {
                    _user_id: 1,
                    followers: 1
                }
            }
            ]);

            const { followers } = doc[0] || {};
            const finalResult = followers ? followers : [];
            res.status(200).send(makeResponseJson(finalResult))
        } catch (e) {
            console.log('CANT GET FOLLOWERS', e);
            res.status(500).send(makeErrorJson());
        }
    });

router.get(
    '/v1/people/suggested',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const offset = parseInt(req.query.offset) || 0;
            const skipParam = parseInt(req.query.skip) || 0;

            const limit = parseInt(req.query.limit) || 10;
            const skip = skipParam || offset * limit;

            const myFollowing = await Follow.findOne({ _user_id: req.user._id });
            const people = await User
                .find({
                    _id: {
                        $nin: [...myFollowing.following, req.user._id]
                    }
                })
                .limit(limit)
                .skip(skip);

            if (people.length === 0) return res.status(404).send(makeErrorJson({ message: 'No suggested people.' }))

            const result = people.map((user) => {
                return {
                    ...user.toUserJSON(),
                    isFollowing: false
                }
            });

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT GET SUGGESTED PEOPLE', e);
            res.status(500).send(makeErrorJson());
        }
    }
)

module.exports = router;
