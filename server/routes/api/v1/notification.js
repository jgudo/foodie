const { makeResponseJson } = require('../../../helpers/utils');
const { isAuthenticated } = require('../../../middlewares/middlewares');
const Notification = require('../../../schemas/NotificationSchema');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/notifications',
    isAuthenticated,
    async (req, res, next) => {
        try {
            const { offset: off } = req.query;
            let offset = 0;
            if (typeof off !== undefined && !isNaN(off)) offset = parseInt(off);

            const limit = 10;
            const skip = offset * limit;

            const notifications = await Notification
                .find({ target: req.user._id })
                .populate('target initiator', 'profilePicture username fullname')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const unreadCount = await Notification.find({ target: req.user._id, unread: true });
            const count = await Notification.find({ target: req.user._id });
            const result = { notifications, unreadCount: unreadCount.length, count: count.length };

            res.status(200).send(makeResponseJson(result));
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }
);

module.exports = router;
