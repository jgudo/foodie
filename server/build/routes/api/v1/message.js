"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const ChatSchema_1 = __importDefault(require("../../../schemas/ChatSchema"));
const MessageSchema_1 = __importDefault(require("../../../schemas/MessageSchema"));
const UserSchema_1 = __importDefault(require("../../../schemas/UserSchema"));
const router = require('express').Router({ mergeParams: true });
router.post('/v1/message/:user_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('user_id'), async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { text } = req.body;
        const user = await UserSchema_1.default.findById(user_id);
        if (!user)
            return res.status(404).send(utils_1.makeErrorJson({ message: 'Receiver not found.' }));
        if (!text)
            return res.status(400).send(utils_1.makeErrorJson({ status_code: 400, message: 'Text is required.' }));
        if (req.user._id.toString() === user_id) {
            return res.status(400).send(utils_1.makeErrorJson({ status_code: 400, message: 'You cant send message to yourself.' }));
        }
        const message = new MessageSchema_1.default({
            from: req.user._id,
            to: mongoose_1.Types.ObjectId(user_id),
            text,
            seen: false,
            createdAt: Date.now(),
        });
        await ChatSchema_1.default
            .findOneAndUpdate({
            participants: {
                $all: [
                    { $elemMatch: { $eq: req.user._id } },
                    { $elemMatch: { $eq: mongoose_1.Types.ObjectId(user_id) } }
                ]
            }
        }, {
            $set: {
                lastmessage: message._id,
                participants: [req.user._id, mongoose_1.Types.ObjectId(user_id)]
            }
        }, { upsert: true });
        await message.save();
        await message
            .populate({
            path: 'from to',
            select: 'username profilePicture fullname'
        })
            .execPopulate();
        // Notify user
        const io = req.app.get('io');
        [user_id, req.user._id.toString()].forEach((user) => {
            io.to(user).emit('newMessage', Object.assign(Object.assign({}, message.toObject()), { isOwnMessage: user === message.from._id.toString() ? true : false }));
        });
        res.status(200).send(utils_1.makeResponseJson(message));
    }
    catch (e) {
        console.log('CANT SEND MESSAGE: ', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/messages', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        let offset = parseInt(req.query.offset) || 0;
        const limit = constants_1.MESSAGES_LIMIT;
        const skip = offset * limit;
        const agg = await ChatSchema_1.default.aggregate([
            {
                $match: {
                    participants: { $in: [req.user._id] }
                }
            },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'messages',
                    localField: 'lastmessage',
                    foreignField: '_id',
                    as: 'message'
                }
            },
            {
                $unwind: '$message'
            },
            {
                $project: {
                    _id: 0,
                    message: 1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'message.from',
                    foreignField: '_id',
                    as: 'message.from'
                }
            },
            { $unwind: '$message.from' },
            {
                $project: {
                    to: '$message.to',
                    text: '$message.text',
                    id: '$message._id',
                    seen: '$message.seen',
                    createdAt: '$message.createdAt',
                    from: {
                        username: '$message.from.username',
                        id: '$message.from._id',
                        profilePicture: '$message.from.profilePicture'
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'message.to'
                }
            },
            { $unwind: '$message.to' },
            {
                $project: {
                    id: 1,
                    from: 1,
                    text: 1,
                    seen: 1,
                    createdAt: 1,
                    to: {
                        username: '$message.to.username',
                        id: '$message.to._id',
                        profilePicture: '$message.to.profilePicture'
                    },
                    isOwnMessage: {
                        $cond: [
                            { $eq: ['$from.id', req.user._id] },
                            true,
                            false
                        ]
                    }
                }
            }
        ]);
        if (agg.length === 0 || typeof agg[0] === 'undefined') {
            return res.status(404).send(utils_1.makeErrorJson({ message: 'You have no messages.' }));
        }
        const sorted = agg.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
        res.status(200).send(utils_1.makeResponseJson(sorted));
    }
    catch (e) {
        console.log('CANT GET MESSAGES', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/messages/unread', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const agg = await MessageSchema_1.default.aggregate([
            {
                $match: {
                    to: req.user._id
                }
            },
            {
                $group: {
                    _id: '$from',
                    seenCount: {
                        $push: {
                            $cond: [
                                { $eq: ['$seen', false] },
                                '$_id',
                                '$$REMOVE'
                            ]
                        }
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    count: {
                        $size: '$seenCount'
                    }
                }
            }
        ]);
        const totalUnseen = agg.reduce((acc, obj) => acc + obj.count, 0);
        res.status(200).send(utils_1.makeResponseJson({ count: totalUnseen }));
    }
    catch (e) {
        console.log('CANT GET MESSAGES', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.patch('/v1/message/read/:from_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('from_id'), async (req, res, next) => {
    try {
        const { from_id } = req.params;
        await MessageSchema_1.default
            .updateMany({
            from: mongoose_1.Types.ObjectId(from_id),
            to: req.user._id,
            seen: false
        }, {
            $set: { seen: true }
        });
        res.status(200).send(utils_1.makeResponseJson({ state: true }));
    }
    catch (e) {
        console.log('CANT READ MESSAGES');
        res.status(500).send(utils_1.makeErrorJson());
    }
});
router.get('/v1/messages/:target_id', middlewares_1.isAuthenticated, middlewares_1.validateObjectID('target_id'), async (req, res, next) => {
    try {
        const { target_id } = req.params;
        const offset = parseInt(req.query.offset) || 0;
        const limit = constants_1.MESSAGES_LIMIT;
        const skip = offset * limit;
        const messages = await MessageSchema_1.default
            .find({
            $or: [
                { from: req.user._id, to: mongoose_1.Types.ObjectId(target_id) },
                { from: mongoose_1.Types.ObjectId(target_id), to: req.user._id }
            ]
        })
            .populate('from', 'username profilePicture')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const mapped = messages.map((msg) => {
            return Object.assign(Object.assign({}, msg.toObject()), { isOwnMessage: msg.from.id === req.user._id.toString() ? true : false });
        });
        if (messages.length === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ status_code: 404, message: 'No messages.' }));
        }
        res.status(200).send(utils_1.makeResponseJson(mapped));
    }
    catch (e) {
        console.log('CANT GET MESSAGES FROM USER', e);
        res.status(500).send(utils_1.makeErrorJson());
    }
});
exports.default = router;
//# sourceMappingURL=message.js.map