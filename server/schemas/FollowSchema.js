const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
    _user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: []
    }],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

module.exports = mongoose.model('Follow', FollowSchema);
