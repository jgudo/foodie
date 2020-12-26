const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    comments: [{
        
    }]
});

module.exports = mongoose.model('Comment', CommentSchema);
