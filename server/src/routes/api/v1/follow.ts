import { USERS_LIMIT } from '@/constants/constants';
import { makeResponseJson, sessionizeUser } from '@/helpers/utils';
import { ErrorHandler, isAuthenticated, validateObjectID } from '@/middlewares';
import { Follow, NewsFeed, Notification, Post, User } from '@/schemas';
import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';

const router = Router({ mergeParams: true });

router.post(
    '/v1/follow/:follow_id',
    isAuthenticated,
    validateObjectID('follow_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { follow_id } = req.params;

            const user = User.findById(follow_id);
            // CHECK IF FOLLOWING USER EXIST
            if (!user) return next(new ErrorHandler(400, 'The person you\'re trying to follow doesn\'t exist.'));
            // CHECK IF FOLLOWING IS NOT YOURSELF
            if (follow_id === req.user._id.toString()) return next(new ErrorHandler(400, 'You can\'t follow yourself.'));

            //  CHECK IF ALREADY FOLLOWING
            const isFollowing = await Follow
                .findOne({
                    _user_id: req.user._id,
                    following: {
                        $in: [Types.ObjectId(follow_id)]
                    }
                });

            if (isFollowing) return next(new ErrorHandler(400, 'Already following.'));

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

            // TODO ---- FILTER OUT DUPLICATES
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
                    await doc
                        .populate({
                            path: 'target initiator',
                            select: 'fullname profilePicture username'
                        }).execPopulate();

                    io.to(follow_id).emit('newNotification', { notification: doc, count: 1 });
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
                        post_owner: post._author_id,
                        createdAt: post.createdAt
                    }
                });

                await NewsFeed.insertMany(feeds);
            }
            res.status(200).send(makeResponseJson({ state: true }));
        } catch (e) {
            console.log('CANT FOLLOW USER, ', e);
            next(e);
        }
    }
);

router.post(
    '/v1/unfollow/:follow_id',
    isAuthenticated,
    validateObjectID('follow_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { follow_id } = req.params;

            const user = User.findById(follow_id);
            if (!user) return next(new ErrorHandler(400, 'The person you\'re trying to unfollow doesn\'t exist.'));
            if (follow_id === req.user._id.toString()) return next(new ErrorHandler(400));

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
            next(e);
        }
    }
);

router.get(
    '/v1/:username/following',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username } = req.params;
            const offset = parseInt(req.query.offset) || 0;
            const limit = USERS_LIMIT;
            const skip = offset * limit;

            // TODO ---------- TEST LIMIT AND SKIP
            const follow = await Follow.findOne({ _user_id: req.user._id });
            const myFollowing = follow ? follow.following : [];
            const user = await User.findOne({ username });
            if (!user) return next(new ErrorHandler(400));

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
                return next(new ErrorHandler(404, `${username} isn't following anyone.`));
            }

            res.status(200).send(makeResponseJson(finalResult));
        } catch (e) {
            next(e);
        }
    });

router.get(
    '/v1/:username/followers',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username } = req.params;
            const offset = parseInt(req.query.offset) || 0;
            const limit = USERS_LIMIT;
            const skip = offset * limit;

            const follow = await Follow.findOne({ _user_id: req.user._id });
            const selfFollowing = follow ? follow.following : [];

            const user = await User.findOne({ username });
            if (!user) return next(new ErrorHandler(400, `No ${username} user found.`));

            const doc = await Follow.aggregate([
                {
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
                return next(new ErrorHandler(404, `${username} has no followers.`));
            }

            res.status(200).send(makeResponseJson(finalResult))
        } catch (e) {
            console.log('CANT GET FOLLOWERS', e);
            next(e);
        }
    });

router.get(
    '/v1/people/suggested',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const skipParam = parseInt(req.query.skip as string) || 0;

            const limit = parseInt(req.query.limit as string) || USERS_LIMIT;
            const skip = skipParam || offset * limit;

            const myFollowing = await Follow.findOne({ _user_id: req.user._id });
            let following = [];

            if (myFollowing) following = myFollowing.following;

            console.log(limit)
            const people = await User.aggregate([
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

            if (people.length === 0) return next(new ErrorHandler(404, 'No suggested people.'));

            // I want my own account to be on top :) 
            // Just remove this xD
            if (limit < 10) { // If less than 10, I want to only append mine in Home page Suggested people list
                const julius = await User.findOne({ username: 'jgudo' });
                if (julius) {
                    people.unshift({
                        ...sessionizeUser(julius),
                        isFollowing: following.includes(julius._id.toString())
                    });
                }
            }
            // ---

            res.status(200).send(makeResponseJson(people));
        } catch (e) {
            console.log('CANT GET SUGGESTED PEOPLE', e);
            next(e);
        }
    }
)

export default router;
