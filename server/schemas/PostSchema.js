const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    _author_id: {
        // author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_owner: { // used for fetching posts based on username
        type: String,
        required: true
    },
    privacy: {
        type: String,
        default: 'public'
    },
    photos: [String],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    description: {
        type: String,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: Date,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

PostSchema.virtual('author', {
    ref: 'User',
    localField: '_author_id',
    foreignField: '_id',
    justOne: true
});

PostSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: 'comments',
    foreignField: '_id',
    count: true
})

module.exports = mongoose.model('Post', PostSchema);
