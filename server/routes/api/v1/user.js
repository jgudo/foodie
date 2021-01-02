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

module.exports = router;
