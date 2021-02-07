"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookmarkSchema = new mongoose_1.Schema({
    _post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    _author_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.model('Bookmark', BookmarkSchema);
//# sourceMappingURL=BookmarkSchema.js.map