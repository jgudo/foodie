const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: String,
    _commentor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

CommentSchema.virtual('commentor', {
    ref: 'User',
    localField: '_commentor_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Comment', CommentSchema);
