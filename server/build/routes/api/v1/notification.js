"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../constants/constants");
const utils_1 = require("../../../helpers/utils");
const middlewares_1 = require("../../../middlewares/middlewares");
const NotificationSchema_1 = __importDefault(require("../../../schemas/NotificationSchema"));
const router = require('express').Router({ mergeParams: true });
router.get('/v1/notifications', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        let offset = parseInt(req.query.offset) || 0;
        const limit = constants_1.NOTIFICATIONS_LIMIT;
        const skip = offset * limit;
        const notifications = await NotificationSchema_1.default
            .find({ target: req.user._id })
            .populate('target initiator', 'profilePicture username fullname')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const unreadCount = await NotificationSchema_1.default.find({ target: req.user._id, unread: true });
        const count = await NotificationSchema_1.default.find({ target: req.user._id });
        const result = { notifications, unreadCount: unreadCount.length, count: count.length };
        if (notifications.length === 0 && offset === 0) {
            return res.status(404).send(utils_1.makeErrorJson({ message: 'You have no notifications.' }));
        }
        else if (notifications.length === 0 && offset >= 1) {
            return res.status(404).send(utils_1.makeErrorJson({ message: 'No more notifications.' }));
        }
        res.status(200).send(utils_1.makeResponseJson(result));
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
router.get('/v1/notifications/unread', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const notif = await NotificationSchema_1.default.find({ target: req.user._id, unread: true });
        res.status(200).send(utils_1.makeResponseJson({ count: notif.length }));
    }
    catch (e) {
        console.log('CANT GET UNREAD NOTIFICATIONS', e);
        res.status(400).send(e);
    }
});
router.patch('/v1/notifications/mark', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        await NotificationSchema_1.default
            .updateMany({ target: req.user._id }, {
            $set: {
                unread: false
            }
        });
        res.status(200).send(utils_1.makeResponseJson({ state: false }));
    }
    catch (e) {
        console.log('CANT MARK ALL AS UNREAD', e);
        res.status(400).send(e);
    }
});
router.patch('/v1/read/notification/:id', middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const { id } = req.params;
        const notif = await NotificationSchema_1.default.findById(id);
        if (!notif)
            return res.sendStatus(400);
        const result = await NotificationSchema_1.default
            .findByIdAndUpdate(id, {
            $set: {
                unread: false
            }
        });
        res.status(200).send(utils_1.makeResponseJson({ state: false })); // state = false EQ unread = false
    }
    catch (e) {
    }
});
exports.default = router;
//# sourceMappingURL=notification.js.map