const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    comments: [{
        text: String,
        _commented_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

module.exports = mongoose.model('Comment', CommentSchema);
