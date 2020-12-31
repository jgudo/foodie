const omit = require('lodash.omit');
const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const { makeResponseJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');
const { validateBody, schemas } = require('../../../validations/validations');
const mongoose = require('mongoose');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/:username',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const user = await User
                .findOne({ username })
                .populate({
                    path: 'posts',
                    model: 'Post',
                    select: 'description name photos comments createdAt',
                    options: {
                        limit: 3,
                        sort: { createdAt: -1 },
                    },
                    populate: {
                        path: '_author_id', // <--- virtual 'author' not working :(
                        select: 'username fullname profilePicture'
                    }
                })
                .sort('-createdAt');

            // RENAME _author_id PROPERTY TO author SINCE NESTED POPULATE VIRTUAL NOT WORKING :(
            // DO THIS FOR CONSISTENCY 
            const toObjectUser = user.toUserJSON(); // this will omit private data like password, etc..
            toObjectUser.posts = toObjectUser.posts.map((post) => {
                const { _author_id: author } = post;

                return { ...omit(post, ['_author_id']), author };
            });

            if (req.user.username !== username) {
                toObjectUser.isFollowing = req.user.isFollowing(user._id);
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

router.post(
    '/v1/follow/:user_id',
    isAuthenticated,
    validateObjectID('user_id'),
    async (req, res, next) => {
        try {
            const { user_id } = req.params;

            const user = User.findById(user_id);
            if (!user) return res.sendStatus(404);
            if (user_id === req.user._id.toString()) return res.sendStatus(400);

            let op = '$push';
            const isFollowing = req.user.isFollowing(user_id);

            if (isFollowing) op = '$pull';

            const query = {
                user: {
                    [op]: { followers: req.user._id }
                },
                self: {
                    [op]: { following: user_id }
                }
            };

            const followedUser = await User.findByIdAndUpdate(user_id, query.user, { new: true }); // UPDATE USER'S FOLLOWERS/FOLLOWING
            await User.findByIdAndUpdate(req.user._id, query.self); // UPDATE OWN FOLLOWERS/FOLLOWING
            const resUser = { ...followedUser.toObject(), isFollowing: !isFollowing };

            res.status(200).send(makeResponseJson(resUser));
        } catch (e) {
            console.log('CANT FOLLOW USER, ', e);
            res.status(500).send(e);
        }
    }
);

router.get(
    '/v1/:username/following',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const { offset: off } = req.query;

            let offset = 0;
            if (typeof off !== undefined && !isNaN(off)) offset = parseInt(off);

            const limit = 10;
            const skip = offset * limit;

            const user = await User
                .findOne({ username })
                .populate({
                    path: 'following',
                    select: 'profilePicture username fullname',
                    options: {
                        skip,
                        limit,
                    }
                })

            res.status(200).send(user.following);
        } catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    }
);

router.get(
    '/v1/:username/followers',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const { offset: off } = req.query;

            let offset = 0;
            if (typeof off !== undefined && !isNaN(off)) offset = parseInt(off);

            const limit = 10;
            const skip = offset * limit;

            const user = await User
                .findOne({ username })
                .populate({
                    path: 'followers',
                    select: 'profilePicture username fullname',
                    options: {
                        skip,
                        limit,
                    }
                })

            res.status(200).send(user.followers);
        } catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    }
);

module.exports = router;
