const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    _post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    _author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
