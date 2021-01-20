const { makeErrorJson, makeResponseJson } = require('../../../helpers/utils');
const { validateObjectID, isAuthenticated } = require('../../../middlewares/middlewares');
const User = require('../../../schemas/UserSchema');
const Message = require('../../../schemas/MessageSchema');
const { Types } = require('mongoose');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/message/:user_id',
    isAuthenticated,
    validateObjectID('user_id'),
    async (req, res, next) => {
        try {
            const { user_id } = req.params;
            const { text } = req.body;
            const user = await User.findById(user_id);
            if (!user) return res.status(404).send(makeErrorJson({ message: 'Receiver not found.' }));
            if (!text) return res.status(400).send(makeErrorJson({ status_code: 400, message: 'Text is required.' }))

            if (req.user._id.toString() === user_id) {
                return res.status(400).send(makeErrorJson({ status_code: 400, message: 'You cant send message to yourself.' }))
            }

            const message = new Message({
                from: req.user._id,
                to: Types.ObjectId(user_id),
                text,
                seen: false,
                createdAt: Date.now(),
            });

            await message.save();
            await message.populate('from to', 'username profilePicture fullname').execPopulate();

            // Notify user
            const io = req.app.get('io');

            [user_id, req.user._id.toString()].forEach((user) => {
                io.to(user).emit('newMessage', {
                    ...message.toObject(),
                    isOwnMessage: user === message.from.id ? true : false
                });
            });

            res.status(200).send(makeResponseJson(message));
        } catch (e) {
            console.log('CANT SEND MESSAGE: ', e);
            res.status(500).send(makeErrorJson());
        }
    }
)

router.get(
    '/v1/messages',
    isAuthenticated,
    async (req, res, next) => {
        try {
            let offset = parseInt(req.query.offset) || 0;

            const limit = 1;
            const skip = offset * limit;

            const agg = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { from: req.user._id },
                            { to: req.user._id }
                        ]
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                },
                {
                    $facet: {
                        // GROUP BY SENT MESSAGES
                        sent: [
                            { $match: { from: req.user._id } },
                            { $sort: { createdAt: -1 } },
                            {
                                $group: {
                                    _id: '$to',
                                    id: { $first: '$_id' },
                                    seen: { $first: '$seen' },
                                    from: { $first: '$from' },
                                    text: { $first: '$text' },
                                    createdAt: { $first: '$createdAt' }
                                }
                            },
                            // ADD FIELD UNSEENCOUNT TO 0 SINCE IT'S SENT BY YOURSELF AND NO NEED TO ADD SEEN COUNT
                            {
                                $addFields: {
                                    unseenCount: 0,
                                    isOwnMessage: true
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    id: 1,
                                    to: '$_id',
                                    from: 1,
                                    seen: 1,
                                    text: 1,
                                    isOwnMessage: 1,
                                    unseenCount: 1,
                                    createdAt: 1
                                }
                            }
                            // { $limit: 1 }
                        ],
                        received: [
                            { $match: { to: req.user._id } },
                            { $sort: { createdAt: -1 } },
                            {
                                $group: {
                                    _id: '$from',
                                    id: { $first: '$_id' },
                                    to: { $first: '$to' },
                                    text: { $first: '$text' },
                                    seenCount: {
                                        $push: {
                                            $cond: [
                                                { $eq: ['$seen', false] },
                                                '$_id',
                                                '$$REMOVE'
                                            ]
                                        }
                                    },
                                    seen: { $first: '$seen' },
                                    createdAt: { $first: '$createdAt' }
                                }
                            },
                            {
                                $addFields: {
                                    isOwnMessage: false
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    id: 1,
                                    from: '$_id',
                                    to: 1,
                                    isOwnMessage: 1,
                                    text: 1,
                                    seen: 1,
                                    unseenCount: { $size: '$seenCount' },
                                    createdAt: 1
                                }
                            }
                            // { $limit: 1 }
                        ]
                    },
                },
                {
                    $project: {
                        result: {
                            $concatArrays: ['$sent', '$received']
                        },
                    }
                },
                {
                    $unwind: '$result'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'result.from',
                        foreignField: '_id',
                        as: 'result.from'
                    }
                },
                {
                    $unwind: '$result.from'
                },
                {
                    $project: {
                        text: '$result.text',
                        to: '$result.to',
                        unseenCount: '$result.unseenCount',
                        createdAt: '$result.createdAt',
                        id: '$result.id',
                        isOwnMessage: '$result.isOwnMessage',
                        seen: '$result.seen',
                        from: {
                            username: '$result.from.username',
                            profilePicture: '$result.from.profilePicture',
                            id: '$result.from._id',
                            fullname: '$result.from.fullname'
                        },
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'to',
                        foreignField: '_id',
                        as: 'recipient'
                    }
                },
                {
                    $unwind: '$recipient'
                },
                {
                    $project: {
                        from: '$from',
                        to: {
                            username: '$recipient.username',
                            profilePicture: '$recipient.profilePicture',
                            id: '$recipient._id'
                        },
                        text: 1,
                        seen: 1,
                        createdAt: 1,
                        isOwnMessage: 1,
                        unseenCount: 1,
                        id: 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUnseen: { $sum: '$unseenCount' },
                        messages: {
                            $push: {
                                from: '$from',
                                to: '$to',
                                text: '$text',
                                seen: '$seen',
                                createdAt: '$createdAt',
                                isOwnMessage: '$isOwnMessage',
                                unseenCount: '$unseenCount',
                                id: '$id'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        messages: 1,
                        totalUnseen: 1
                    }
                }
            ]);

            const aggMessages = typeof agg[0] === 'undefined' ? [] : agg[0].messages;
            const aggTotalUnseen = typeof agg[0] === 'undefined' ? 0 : agg[0].totalUnseen;

            const getKey = (msg) => [msg.to.username, msg.from.username]
                .sort((a, b) => a.localeCompare(b))
                .join('#');
            const messagesByKey = {};
            for (const msg of aggMessages) {
                const key = getKey(msg);
                if (!messagesByKey[key]) {
                    messagesByKey[key] = [];
                }
                messagesByKey[key].push(msg);
            }

            const grouped = Object.values(messagesByKey);
            const filtered = grouped.map((msg) => {
                const selected = msg.reduce((acc, msg) => {
                    return new Date(acc.createdAt) > new Date(msg.createdAt) ? acc : msg;
                });

                return selected;
            });

            if (filtered.length === 0) {
                return res.status(404).send(makeErrorJson({ message: 'You have no messages.' }));
            }

            res.status(200).send(makeResponseJson({ messages: filtered, totalUnseen: aggTotalUnseen }));
        } catch (e) {
            console.log('CANT GET MESSAGES', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

router.get(
    '/v1/messages/unread',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const agg = await Message.aggregate([
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

            res.status(200).send(makeResponseJson({ count: totalUnseen }));
        } catch (e) {
            console.log('CANT GET MESSAGES', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

router.patch(
    '/v1/message/read/:from_id',
    isAuthenticated,
    validateObjectID('from_id'),
    async (req, res, next) => {
        try {
            const { from_id } = req.params;

            await Message
                .updateMany({
                    from: Types.ObjectId(from_id),
                    to: req.user._id,
                    seen: false
                }, {
                    $set: { seen: true }
                });

            res.status(200).send(makeResponseJson({ state: true }));
        } catch (e) {
            console.log('CANT READ MESSAGES');
            res.status(500).send(makeErrorJson());
        }
    }
);

router.get(
    '/v1/messages/:target_id',
    isAuthenticated,
    validateObjectID('target_id'),
    async (req, res, next) => {
        try {
            const { target_id } = req.params;
            const offset = parseInt(req.query.offset) || 0;
            const limit = 10;
            const skip = offset * limit;

            const messages = await Message
                .find({
                    $or: [
                        { from: req.user._id, to: Types.ObjectId(target_id) },
                        { from: Types.ObjectId(target_id), to: req.user._id }
                    ]
                })
                .populate('from', 'username profilePicture')
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);

            const mapped = messages.map((msg) => {
                return {
                    ...msg.toObject(),
                    isOwnMessage: msg.from.id === req.user._id.toString() ? true : false
                }
            });

            if (messages.length === 0) {
                return res.status(404).send(makeErrorJson({ status_code: 404, message: 'No messages.' }));
            }

            res.status(200).send(makeResponseJson(mapped));
        } catch (e) {
            console.log('CANT GET MESSAGES FROM USER', e);
            res.status(500).send(makeErrorJson());
        }
    }
);

module.exports = router;
