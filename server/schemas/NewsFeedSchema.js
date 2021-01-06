const mongoose = require('mongoose');

const NewsFeedSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    post_owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('NewsFeed', NewsFeedSchema);
