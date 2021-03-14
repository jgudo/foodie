import { makeResponseJson } from '@/helpers/utils';
import { ErrorHandler, isAuthenticated } from '@/middlewares';
import { Follow, User } from '@/schemas';
import { EGender, IUser } from '@/schemas/UserSchema';
import { multer, uploadImageToStorage } from '@/storage/cloudinary';
import { schemas, validateBody } from '@/validations/validations';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router({ mergeParams: true });

router.get(
    '/v1/:username',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqUser = req.user as IUser;
            const { username } = req.params;
            const user = await User.findOne({ username });

            if (!user) return next(new ErrorHandler(404, 'User not found.'));

            const result = await Follow.aggregate([
                {
                    $match: { _user_id: user._id }
                },
                {
                    $project: {
                        following: { $ifNull: ["$following", []] },
                        followers: { $ifNull: ["$followers", []] },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        followingCount: { $size: '$following' },
                        followersCount: { $size: '$followers' },
                        followers: 1
                    }
                },
            ]);

            console.log(result)

            const { followingCount, followersCount, followers } = result[0] || {};

            const toObjectUser = {
                ...user.toUserJSON(),
                followingCount: followingCount || 0,
                followersCount: followersCount || 0
            };

            if (reqUser.username !== username) {
                let isFollowing = false;

                if (followers) {
                    isFollowing = followers.some((follower) => {
                        return follower._id.toString() === reqUser._id.toString();
                    });
                }

                toObjectUser.isFollowing = isFollowing;
            }

            toObjectUser.isOwnProfile = reqUser.username === username

            res.status(200).send(makeResponseJson(toObjectUser));
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
)

interface IUpdate {
    firstname?: string;
    lastname?: string;
    info?: {
        bio?: string;
        birthday?: string | number;
        gender?: EGender;
    }
}

router.patch(
    '/v1/:username/edit',
    isAuthenticated,
    validateBody(schemas.editProfileSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username } = req.params;
            const { firstname, lastname, bio, birthday, gender } = req.body;
            const update: IUpdate = { info: {} };
            if (username !== (req.user as IUser).username) return next(new ErrorHandler(401));


            if (typeof firstname !== 'undefined') update.firstname = firstname;
            if (typeof lastname !== 'undefined') update.lastname = lastname;
            if (bio) update.info.bio = bio;
            if (birthday) update.info.birthday = birthday;
            if (gender) update.info.gender = gender;

            const newUser = await User
                .findOneAndUpdate({ username }, {
                    $set: update
                }, {
                    new: true
                });

            res.status(200).send(makeResponseJson(newUser.toUserJSON()));
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
)

router.post(
    '/v1/upload/:field',
    isAuthenticated,
    multer.single('photo'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { field } = req.params;
            const file = req.file;

            if (!file) return next(new ErrorHandler(400, 'File not provided.'));
            if (!['picture', 'cover'].includes(field)) return next(new ErrorHandler(400, `Unexpected field ${field}`));


            const image = await uploadImageToStorage(file, `${req.user.username}/profile`);
            const fieldToUpdate = field === 'picture' ? 'profilePicture' : 'coverPhoto';

            await User.findByIdAndUpdate((req.user as IUser)._id, {
                $set: {
                    [fieldToUpdate]: image
                }
            });

            res.status(200).send(makeResponseJson(image));
        } catch (e) {
            console.log('CANT UPLOAD FILE: ', e);
            next(e);
        }
    }
);

export default router;
