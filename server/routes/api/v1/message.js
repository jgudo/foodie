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
                createdAt: Date.now(),
            });

            await message.save();
            await message.populate('from to', 'username profilePicture fullname').execPopulate();
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
            const agg = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { from: req.user._id },
                            { to: req.user._id }
                        ]
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: '$to',
                        seenCount: {
                            $push: {
                                $cond: [
                                    { $eq: ['$seen', false] },
                                    '$_id',
                                    '$$REMOVE'
                                ]
                            }
                        },
                        from: { $first: '$from' },
                        text: { $first: '$text' },
                        createdAt: { $first: '$createdAt' },
                        seen: { $first: '$seen' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'from',
                        foreignField: '_id',
                        as: 'from'
                    }
                },
                {
                    $unwind: '$from'
                },
                {
                    $project: {
                        username: '$from.username',
                        profilePicture: '$from.profilePicture',
                        user_id: '$from._id',
                        seenCount: 1,
                        text: 1,
                        to: '$_id',
                        createdAt: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        from: {
                            id: '$user_id',
                            username: '$username',
                            profilePicture: '$profilePicture'
                        },
                        unseenCount: {
                            $size: '$seenCount'
                        },
                        to: 1,
                        text: 1,
                        seen: 1,
                        createdAt: 1
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
                        unseenCount: 1
                    }
                }
            ]);

            res.status(200).send(agg);
        } catch (e) {
            console.log('CANT GET MESSAGES', e);
            res.status(500).send(makeErrorJson());
        }
    }
)

module.exports = router;
