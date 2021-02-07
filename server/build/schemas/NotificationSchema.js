"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENotificationType = void 0;
const mongoose_1 = require("mongoose");
var ENotificationType;
(function (ENotificationType) {
    ENotificationType["follow"] = "follow";
    ENotificationType["like"] = "like";
    ENotificationType["comment"] = "comment";
})(ENotificationType = exports.ENotificationType || (exports.ENotificationType = {}));
const NotificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: ['follow', 'like', 'comment'],
    },
    initiator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true,
        getters: true
    }
});
const Notification = mongoose_1.model('Notification', NotificationSchema);
exports.default = Notification;
//# sourceMappingURL=NotificationSchema.js.map