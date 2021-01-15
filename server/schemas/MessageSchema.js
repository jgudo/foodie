const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true
    }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

module.exports = mongoose.model('Message', MessageSchema);
