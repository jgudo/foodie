const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['follow', 'like', 'comment'],
    },
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
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

NotificationSchema.static.toMessage = function (initiator, type) {
    switch (type) {
        case 'follow':
            return `${initiator} started following you.`;
        case 'like':
            return `${initiator} likes your post.`;
        case `comment`:
            return `${initiator} commented on your post.`;
        default:
            throw new Error('Unexpected notification type.');
    }
}

module.exports = mongoose.model('Notification', NotificationSchema);
