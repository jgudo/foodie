const omit = require('lodash.omit');
const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const { makeResponseJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');
const { validateBody, schemas } = require('../../../validations/validations');
const mongoose = require('mongoose');
const Follow = require('../../../schemas/FollowSchema');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/:username',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username });

            if (!user) return res.sendStatus(404);

            const followCounts = await Follow.aggregate([
                {
                    $match: { _user_id: user._id }
                },
                {
                    $project: {
                        _id: 0,
                        followingCount: { $size: '$following' },
                        followersCount: { $size: '$followers' },
                        followers: 1
                    }
                },
            ]);
            const followingCount = followCounts[0] ? followCounts[0].followingCount : 0;
            const followersCount = followCounts[0] ? followCounts[0].followersCount : 0;

            const toObjectUser = { ...user.toUserJSON(), followingCount, followersCount };

            if (req.user.username !== username && followCounts[0]) {
                const isFollowing = followCounts[0].followers.some((follower) => {
                    return follower._id.toString() === req.user._id.toString();
                });

                toObjectUser.isFollowing = isFollowing;
            }

            res.status(200).send(makeResponseJson(toObjectUser));
        } catch (e) {
            console.log(e)
            res.sendStatus(400);
        }
    }
)

router.patch(
    '/v1/:username/edit',
    isAuthenticated,
    validateBody(schemas.editProfileSchema),
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const { firstname, lastname, bio } = req.body;
            if (username !== req.user.username) return res.sendStatus(401);

            const newUser = await User
                .findOneAndUpdate({ username }, {
                    $set: {
                        firstname, lastname, bio
                    }
                }, {
                    new: true
                });
            res.status(200).send(makeResponseJson(newUser));
        } catch (e) {
            console.log(e);
            res.status(401).send(e);
        }
    }
)

module.exports = router;
