import { makeResponseJson } from '@/helpers/utils';
import { ErrorHandler } from '@/middlewares';
import { Follow, User } from '@/schemas';
import { EPrivacy } from '@/schemas/PostSchema';
import { PostService } from '@/services';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router({ mergeParams: true });

router.get(
    '/v1/search',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { q, type } = req.query;
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = offset * limit;

            if (!q) return next(new ErrorHandler(400, 'Search query is required.'));

            let result = [];

            if (type === 'posts') {
                const posts = await PostService
                    .getPosts(
                        req.user,
                        {
                            description: {
                                $regex: q,
                                $options: 'i'
                            },
                            privacy: EPrivacy.public
                        },
                        {
                            sort: { createdAt: -1 },
                            skip,
                            limit
                        }
                    );

                if (posts.length === 0) {
                    return next(new ErrorHandler(404, 'No posts found.'));
                }

                result = posts;
                // console.log(posts);
            } else {
                const users = await User
                    .find({
                        $or: [
                            { firstname: { $regex: q, $options: 'i' } },
                            { lastname: { $regex: q, $options: 'i' } },
                            { username: { $regex: q, $options: 'i' } }
                        ]
                    })
                    .limit(limit)
                    .skip(skip);

                if (users.length === 0) {
                    return next(new ErrorHandler(404, 'No users found.'));
                }

                const myFollowingDoc = await Follow.find({ user: req.user?._id });
                const myFollowing = myFollowingDoc.map(user => user.target);

                const usersResult = users.map((user) => {
                    return {
                        ...user.toProfileJSON(),
                        isFollowing: myFollowing.includes(user.id)
                    }
                });

                result = usersResult;
            }

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT PERFORM SEARCH: ', e);
            next(e);
        }

    }
);

export default router;
