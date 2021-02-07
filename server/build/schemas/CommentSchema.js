"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    _post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: String,
    _author_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });
CommentSchema.virtual('author', {
    ref: 'User',
    localField: '_author_id',
    foreignField: '_id',
    justOne: true
});
exports.default = mongoose_1.model('Comment', CommentSchema);
//# sourceMappingURL=CommentSchema.js.map