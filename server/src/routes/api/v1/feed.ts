import { NextFunction, Request, Response } from 'express';
import { FEED_LIMIT } from '../../../constants/constants';
import { makeErrorJson, makeResponseJson } from '../../../helpers/utils';
import NewsFeed from '../../../schemas/NewsFeedSchema';
import Post, { EPrivacy } from '../../../schemas/PostSchema';

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/feed',
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const offset = parseInt((req.query.offset as string), 10) || 0;
            const limit = FEED_LIMIT;
            const skip = offset * limit;

            let result = [];

            if (req.isAuthenticated()) {
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
                    .filter(feed => {
                        if (feed.post) {
                            return feed.post.privacy === 'follower' || feed.post.privacy === 'public';
                        }
                    }) // filter out null posts (users that have been deleted but posts still in db)
                    .map((feed) => {
                        const isPostLiked = feed.post.isPostLiked(req.user._id);
                        const isBookmarked = req.user.isBookmarked(feed.post.id);
                        const isOwnPost = feed.post._author_id.toString() === req.user._id.toString();

                        return { ...feed.post.toObject(), isLiked: isPostLiked, isBookmarked, isOwnPost };
                    });

                if (filteredFeed.length === 0) {
                    return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No more feed.' }));
                }

                result = filteredFeed;
            } else {
                const feeds = await Post
                    .find({ privacy: EPrivacy.public })
                    .sort({ createdAt: -1 })
                    .populate({
                        path: 'author likesCount commentsCount',
                        select: 'profilePicture username fullname',
                    })
                    .limit(limit)
                    .skip(skip);

                if (feeds.length === 0) {
                    return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No more feed.' }));
                }

                result = feeds;
            }

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT GET FEED', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

export default router;
