const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    lastmessage: {
        type: mongoose.Types.ObjectId,
        ref: 'Message'
    }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

module.exports = mongoose.model('Chat', ChatSchema);
