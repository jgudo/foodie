const { isAuthenticated } = require('../../../middlewares/withAuth');
const { makeResponseJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');
const { validateBody, schemas } = require('../../../validations/validations');

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
                        path: '_author_id',
                        select: 'username fullname profilePicture'
                    }
                })
                .sort('-createdAt')

            await user.populate('posts.author').execPopulate();
            res.status(200).send(makeResponseJson(user.toUserJSON()));
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
