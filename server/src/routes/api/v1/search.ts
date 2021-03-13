import { makeResponseJson } from '@/helpers/utils';
import { ErrorHandler } from '@/middlewares';
import { Follow, Post, User } from '@/schemas';
import { EPrivacy } from '@/schemas/PostSchema';
import { NextFunction, Request, Response, Router } from 'express';
import omit from 'lodash.omit';

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
                const posts = await Post
                    .find({
                        description: {
                            $regex: q,
                            $options: 'i'
                        },
                        privacy: EPrivacy.public
                    })
                    .populate('likesCount commentsCount')
                    .populate('author', 'profilePicture fullname username')
                    .limit(limit)
                    .skip(skip);

                if (posts.length === 0) {
                    return next(new ErrorHandler(404, 'No posts found.'));
                }

                const postsMerged = posts.map((post) => {
                    const isPostLiked = post.isPostLiked(req.user._id);
                    const isBookmarked = req.user.isBookmarked(post.id);

                    return { ...post.toObject(), isLiked: isPostLiked, isBookmarked };
                });

                result = postsMerged;
                // console.log(posts);
            } else {
                let following = [];
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

                if (req.isAuthenticated()) {
                    const myFollowing = await Follow.findOne({ _user_id: req.user._id });
                    following = !myFollowing ? [] : myFollowing.following;

                    const usersMerged = users.map((user) => {
                        return {
                            ...omit(user.toUserJSON(), 'bookmarks'),
                            isFollowing: following.includes(user.id)
                        }
                    });

                    result = usersMerged;
                } else {
                    result = users;
                }
            }

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT PERFORM SEARCH: ', e);
            next(e);
        }

    }
);

export default router;
