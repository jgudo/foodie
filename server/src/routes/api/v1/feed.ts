import { FEED_LIMIT } from '@/constants/constants';
import { makeResponseJson } from '@/helpers/utils';
import { ErrorHandler } from '@/middlewares';
import { EPrivacy } from '@/schemas/PostSchema';
import { NewsFeedService, PostService } from '@/services';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router({ mergeParams: true });

router.get(
    '/v1/feed',
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const offset = parseInt((req.query.offset as string), 10) || 0;
            const limit = FEED_LIMIT;
            const skip = offset * limit;

            let result = [];

            if (req.isAuthenticated()) {
                result = await NewsFeedService.getNewsFeed(
                    req.user, 
                    { follower: req.user._id }, 
                    skip, 
                    limit
                );
            } else {
                result = await PostService.getPosts(null, { privacy: EPrivacy.public }, { skip, limit, sort: { createdAt: -1 } });
            }

            if (result.length === 0) {
                return next(new ErrorHandler(404, 'No more feed.'));
            }

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT GET FEED', e);
            next(e);
        }
    }
);

export default router;
