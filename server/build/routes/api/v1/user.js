"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const FollowSchema_1 = __importDefault(require("../../../schemas/FollowSchema"));
const UserSchema_1 = __importDefault(require("../../../schemas/UserSchema"));
const filestorage_1 = require("../../../storage/filestorage");
const validations_1 = require("../../../validations/validations");
const router = require('express').Router({ mergeParams: true });
router.get('/v1/:username', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const reqUser = req.user;
        const { username } = req.params;
        const user = await UserSchema_1.default.findOne({ username });
        if (!user)
            return res.sendStatus(404);
        const result = await FollowSchema_1.default.aggregate([
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
        console.log(result);
        const { followingCount, followersCount, followers } = result[0] || {};
        const toObjectUser = Object.assign(Object.assign({}, user.toUserJSON()), { followingCount: followingCount || 0, followersCount: followersCount || 0 });
        if (reqUser.username !== username) {
            let isFollowing = false;
            if (followers) {
                isFollowing = followers.some((follower) => {
                    return follower._id.toString() === reqUser._id.toString();
                });
            }
            toObjectUser.isFollowing = isFollowing;
        }
        toObjectUser.isOwnProfile = reqUser.username === username;
        res.status(200).send(utils_1.makeResponseJson(toObjectUser));
    }
    catch (e) {
        console.log(e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.patch('/v1/:username/edit', middlewares_1.isAuthenticated, validations_1.validateBody(validations_1.schemas.editProfileSchema), async (req, res, next) => {
    try {
        const { username } = req.params;
        const { firstname, lastname, bio, birthday, gender } = req.body;
        const update = { info: {} };
        if (username !== req.user.username)
            return res.sendStatus(401);
        if (typeof firstname !== 'undefined')
            update.firstname = firstname;
        if (typeof lastname !== 'undefined')
            update.lastname = lastname;
        if (bio)
            update.info.bio = bio;
        if (birthday)
            update.info.birthday = birthday;
        if (gender)
            update.info.gender = gender;
        const newUser = await UserSchema_1.default
            .findOneAndUpdate({ username }, {
            $set: update
        }, {
            new: true
        });
        res.status(200).send(utils_1.makeResponseJson(newUser.toUserJSON()));
    }
    catch (e) {
        console.log(e);
        res.status(401).send(utils_1.makeErrorJson());
    }
});
router.post('/v1/upload/:field', middlewares_1.isAuthenticated, filestorage_1.multer.single('photo'), async (req, res, next) => {
    try {
        const { field } = req.params;
        const file = req.file;
        if (!file)
            return res.status(400).send(utils_1.makeErrorJson({ status_code: 400, message: 'File not provided.' }));
        if (!['picture', 'cover'].includes(field))
            return res.status(400).send(utils_1.makeErrorJson({ message: 'Unexpected field.' + field }));
        const url = await filestorage_1.uploadImageToStorage(file);
        const fieldToUpdate = field === 'picture' ? 'profilePicture' : 'coverPhoto';
        await UserSchema_1.default.findByIdAndUpdate(req.user._id, {
            $set: {
                [fieldToUpdate]: url
            }
        });
        res.status(200).send(utils_1.makeResponseJson(url));
    }
    catch (e) {
        console.log('CANT UPLOAD FILE: ', e);
        res.status(500).send(utils_1.makeErrorJson({ status_code: 400, message: e }));
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map