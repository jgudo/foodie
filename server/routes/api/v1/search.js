const { makeErrorJson, makeResponseJson } = require('../../../helpers/utils');
const { isAuthenticated } = require('../../../middlewares/middlewares');
const Post = require('../../../schemas/PostSchema');
const User = require('../../../schemas/UserSchema');
const Follow = require('../../../schemas/FollowSchema');
const omit = require('lodash.omit');
const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/search',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { q, type } = req.query;
            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const skip = offset * limit;

            if (!q) return res.status(400).send(makeErrorJson());
            let result = [];

            if (type === 'posts') {
                const posts = await Post
                    .find({
                        description: {
                            $regex: q,
                            $options: 'i'
                        },
                        privacy: 'public'
                    })
                    .populate('likesCount commentsCount')
                    .populate('author', 'profilePicture fullname username')
                    .limit(limit)
                    .skip(skip);

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
                const myFollowing = await Follow.findOne({ _user_id: req.user._id });
                following = myFollowing.following;

                const usersMerged = users.map((user) => {
                    return {
                        ...omit(user.toUserJSON(), 'bookmarks'),
                        isFollowing: following.includes(user.id)
                    }
                });

                result = usersMerged;
            }

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT PERFORM SEARCH: ', e);
            res.status(500).send(makeErrorJson());
        }

    }
);

module.exports = router;
