const { makeResponseJson } = require('../../../helpers/utils');
const { isAuthenticated } = require('../../../middlewares/middlewares');
const NewsFeed = require('../../../schemas/NewsFeedSchema');
const Post = require('../../../schemas/PostSchema');
const User = require('../../../schemas/UserSchema');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/feed',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { offset: off } = req.query;
            let offset = 0;
            if (typeof off !== undefined && !isNaN(off)) offset = parseInt(off);

            const limit = 1;
            const skip = offset * limit;

            const feed = await NewsFeed
                .find({ follower: req.user._id })
                .populate({
                    path: 'post',
                })
                .sort({ 'post.createdAt': -1 })
                .skip(skip)
                .limit(limit);

            res.status(200).send(makeResponseJson(feed));
        } catch (e) {
            console.log('CANT GET FEED', e);
            res.sendStatus(500);
        }
    }
);

module.exports = router;
