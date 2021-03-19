import { LIKES_LIMIT, POST_LIMIT } from '@/constants/constants';
import { filterWords, makeResponseJson } from '@/helpers/utils';
import { ErrorHandler, isAuthenticated, validateObjectID } from '@/middlewares';
import { Bookmark, Comment, Follow, Like, NewsFeed, Notification, Post, User } from '@/schemas';
import { ENotificationType } from '@/schemas/NotificationSchema';
import { EPrivacy } from '@/schemas/PostSchema';
import { PostService } from '@/services';
import { deleteImageFromStorage, multer, uploadImageToStorage } from '@/storage/cloudinary';
import { schemas, validateBody } from '@/validations/validations';
import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';

const router = Router({ mergeParams: true });

router.post(
    '/v1/post',
    isAuthenticated,
    multer.array('photos', 5),
    validateBody(schemas.createPostSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { description, privacy } = req.body;

            let photos = [];
            if (req.files) {
                const photosToSave = req.files.map((file) => uploadImageToStorage(file, `${req.user.username}/posts`));
                photos = await Promise.all(photosToSave);

                console.log(photos)
            }

            const post = new Post({
                _author_id: req.user._id,
                // author: req.user._id,
                description: filterWords.clean(description),
                photos,
                privacy: privacy || 'public',
                createdAt: Date.now()
            });

            await post.save();
            await post
                .populate({
                    path: 'author',
                    select: 'profilePicture username fullname'
                })
                .execPopulate();

            const myFollowers = await Follow.findOne({ _user_id: req.user._id });
            const followers = !myFollowers ? [] : myFollowers.followers;
            let newsFeeds = [];

            // add post to follower's newsfeed
            if (myFollowers && myFollowers.followers) {
                newsFeeds = myFollowers.followers.map(follower => ({
                    follower: Types.ObjectId(follower._id),
                    post: Types.ObjectId(post._id),
                    post_owner: req.user._id,
                    createdAt: post.createdAt
                }));
            }
            // append own post on newsfeed
            newsFeeds = newsFeeds.concat({
                follower: req.user._id,
                post_owner: req.user._id,
                post: Types.ObjectId(post._id),
                createdAt: post.createdAt
            });

            if (newsFeeds.length !== 0) {
                await NewsFeed.insertMany(newsFeeds);
            }

            // Notify followers that new post has been made 
            const io = req.app.get('io');
            followers.forEach((user) => {
                io.to(user._id.toString()).emit('newFeed', {
                    ...post.toObject(),
                    isOwnPost: false
                });
            });

            return res.status(200).send(makeResponseJson({ ...post.toObject(), isOwnPost: true }));
        } catch (e) {
            console.log(e);
            next(e);
        }
    });

router.get(
    '/v1/:username/posts',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username } = req.params;
            const { sortBy, sortOrder } = req.query;

            const offset = parseInt(req.query.offset as string) || 0;

            const user = await User.findOne({ username });
            const myFollowing = await Follow.findOne({ _user_id: req.user._id });
            const following = myFollowing?.following || [];

            if (!user) return next(new ErrorHandler(404, 'User not found'));

            const limit = POST_LIMIT;
            const skip = offset * limit;
            const query = {
                _author_id: Types.ObjectId(user._id),
                privacy: { $in: [EPrivacy.public] },
            };
            const sortQuery = {
                [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1
            };

            if (username === req.user.username) {
                query.privacy.$in = [EPrivacy.public, EPrivacy.follower, EPrivacy.private];
            } else if (following.includes(user._id.toString())) {
                query.privacy.$in = [EPrivacy.public, EPrivacy.follower];
            }

            // run aggregation service
            const agg = await PostService.getPosts(req.user, query, { skip, limit });

            if (agg.length <= 0 && offset === 0) {
                return next(new ErrorHandler(404, `${username} hasn't posted anything yet.`));
            } else if (agg.length <= 0 && offset >= 1) {
                return next(new ErrorHandler(404, 'No more posts.'));
            }

            res.status(200).send(makeResponseJson(agg));
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
);

router.post(
    '/v1/like/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);

            if (!post) return next(new ErrorHandler(400, 'Post not found.'));

            const likedPost = await Like.findOne({ _post_id: Types.ObjectId(post_id), _author_id: req.user._id });
            const likesCount = await Like.find({ _post_id: Types.ObjectId(post_id) });

            if (!Boolean(likedPost) && post._author_id.toString() !== req.user._id.toString()) {
                const io = req.app.get('io');
                const targetUserID = Types.ObjectId(post._author_id);
                const newNotif = {
                    type: ENotificationType.like,
                    initiator: req.user._id,
                    target: targetUserID,
                    link: `/post/${post_id}`,
                };
                const notificationExists = await Notification.findOne(newNotif);

                if (!notificationExists) {
                    const notification = new Notification({ ...newNotif, createdAt: Date.now() });

                    const doc = await notification.save();
                    await doc
                        .populate({
                            path: 'target initiator',
                            select: 'fullname profilePicture username'
                        })
                        .execPopulate();

                    io.to(targetUserID).emit('newNotification', { notification: doc, count: 1 });
                } else {
                    await Notification.findOneAndUpdate(newNotif, { $set: { createdAt: Date.now() } });
                }
            }

            res.status(200).send(makeResponseJson({ state: Boolean(likedPost), likesCount: likesCount.length }));
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
);

interface IUpdate {
    description?: string;
    privacy?: EPrivacy;
    updatedAt: number;
    isEdited: boolean;
}

router.patch(
    '/v1/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    validateBody(schemas.createPostSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const { description, privacy } = req.body;
            const obj: IUpdate = { updatedAt: Date.now(), isEdited: true };

            if (!description && !privacy) return next(new ErrorHandler(400));

            if (description) obj.description = filterWords.clean(description.trim());
            if (privacy) obj.privacy = privacy;

            const post = await Post.findById(post_id);
            if (!post) return next(new ErrorHandler(400));

            if (req.user._id.toString() === post._author_id.toString()) {
                const updatedPost = await Post.findByIdAndUpdate(post_id, {
                    $set: obj
                }, {
                    new: true
                });
                await updatedPost
                    .populate({
                        path: 'author',
                        select: 'fullname username profilePicture'
                    })
                    .execPopulate();

                res.status(200).send(makeResponseJson({ ...updatedPost.toObject(), isOwnPost: true }));
            } else {
                return next(new ErrorHandler(401));
            }
        } catch (e) {
            console.log('CANT EDIT POST :', e);
            next(e);
        }
    }
);
// @route /post/:post_id -- DELETE POST
router.delete(
    '/v1/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);
            if (!post) return next(new ErrorHandler(400));

            if (req.user._id.toString() === post._author_id.toString()) {
                const imageIDs = post.photos  // array of image public_ids
                    .filter(img => img?.public_id)
                    .map(img => img.public_id);


                if (post.photos && post.photos.length !== 0) await deleteImageFromStorage(imageIDs);

                await Post.findByIdAndDelete(post_id);
                await Comment.deleteMany({ _post_id: Types.ObjectId(post_id) });
                await NewsFeed.deleteMany({ post: Types.ObjectId(post_id) });
                await Bookmark.deleteMany({ _post_id: Types.ObjectId(post_id) });
                await User.updateMany({
                    bookmarks: {
                        $in: [post_id]
                    }
                }, {
                    $pull: {
                        bookmarks: Types.ObjectId(post_id)
                    }
                });


                res.sendStatus(200);
            } else {
                return next(new ErrorHandler(401));
            }
        } catch (e) {
            console.log('CANT DELETE POST', e);
            next(e);
        }
    }
);

router.get(
    '/v1/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;

            const agg = await PostService.getPosts(req.user, { _id: Types.ObjectId(post_id) });

            const post = agg[0] || {}

            if (!post) return next(new ErrorHandler(400, 'Post not found.'));

            if (post?.privacy === 'private' && post._author_id?.toString() !== req.user._id.toString()) {
                return next(new ErrorHandler(401));
            }

            res.status(200).send(makeResponseJson(post));
        } catch (e) {
            console.log('CANT GET POST', e);
            next(e);
        }
    }
);

router.get(
    '/v1/post/likes/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = LIKES_LIMIT;
            const skip = offset * limit;

            const exist = await Post.findById(Types.ObjectId(post_id));
            if (!exist) return next(new ErrorHandler(400, 'Post not found.'));

            const post = await Post
                .findById(Types.ObjectId(post_id))
                .populate({
                    path: 'likes',
                    select: 'profilePicture username fullname',
                    options: {
                        skip,
                        limit,
                    }
                });

            if (post.likes.length === 0) {
                return next(new ErrorHandler(404, 'No likes found.'));
            }

            const myFollowing = await Follow.findOne({ _user_id: req.user._id });
            const following = (myFollowing && myFollowing.following) ? myFollowing.following : [];

            const result = post.likes.map((user) => {
                return {
                    ...user.toObject(),
                    isFollowing: following.includes(user.id)
                }
            });

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log('CANT GET POST LIKERS', e);
            next(e);
        }
    }
);

export default router;
