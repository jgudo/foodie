const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: String,
    _commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Comment', CommentSchema);
