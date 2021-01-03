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

            const limit = 5;
            const skip = offset * limit;

            const feeds = await NewsFeed
                .find({ follower: req.user._id })
                .populate({
                    path: 'post',
                    populate: {
                        path: 'author likesCount commentsCount',
                        select: 'profilePicture username fullname'
                    },
                })
                .sort({ 'post.createdAt': -1 })
                .skip(skip)
                .limit(limit);

            const filteredFeed = feeds.map((feed) => {
                const isPostLiked = feed.post.isPostLiked(req.user._id);
                return { ...feed.post.toObject(), isLiked: isPostLiked };
            });

            res.status(200).send(makeResponseJson(filteredFeed));
        } catch (e) {
            console.log('CANT GET FEED', e);
            res.sendStatus(500);
        }
    }
);

module.exports = router;
