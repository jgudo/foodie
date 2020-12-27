const { isAuthenticated } = require('../../../middlewares/withAuth');
const { makeResponseJson } = require('../../../helpers/utils');
const User = require('../../../schemas/UserSchema');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/me',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const user = await User
                .findById(req.user._id)
                .populate({
                    path: 'posts',
                    select: '_posted_by description name photos comments createdAt',
                    options: {
                        limit: 3,
                        sort: { createdAt: -1 },
                    },
                    populate: {
                        path: '_posted_by',
                        select: 'username profilePicture'
                    }
                })
                .sort('-createdAt');

            res.status(200).send(makeResponseJson(user.toUserJSON()));
        } catch (e) {
            console.log(e)
            res.sendStatus(400);
        }
    }
)

module.exports = router;
