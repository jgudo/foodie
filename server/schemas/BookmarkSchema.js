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

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

BookmarkSchema.virtual('post', {
    ref: 'Post',
    localField: '_post_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
