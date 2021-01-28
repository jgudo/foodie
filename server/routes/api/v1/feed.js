const { FEED_LIMIT } = require('../../../constants/constants');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const { isAuthenticated } = require('../../../middlewares/middlewares');
const NewsFeed = require('../../../schemas/NewsFeedSchema');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/feed',
    isAuthenticated,
    async (req, res, next) => {

        try {
            const offset = parseInt(req.query.offset) || 0;
            const limit = FEED_LIMIT;
            const skip = offset * limit;

            const feeds = await NewsFeed
                .find({ follower: req.user._id })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'post',
                    populate: {
                        path: 'author likesCount commentsCount',
                        select: 'profilePicture username fullname',
                    },
                })
                .limit(limit)
                .skip(skip)

            const filteredFeed = feeds
                .filter(feed => feed.post) // filter out null posts (users that have been deleted but posts still in db)
                .map((feed) => {
                    const isPostLiked = feed.post.isPostLiked(req.user._id);
                    const isBookmarked = req.user.isBookmarked(feed.post.id);

                    return { ...feed.post.toObject(), isLiked: isPostLiked, isBookmarked };
                });

            if (filteredFeed.length === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No more feed.' }));
            }

            res.status(200).send(makeResponseJson(filteredFeed));
        } catch (e) {
            console.log('CANT GET FEED', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

module.exports = router;
