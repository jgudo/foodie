"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NewsFeedSchema = new mongoose_1.Schema({
    follower: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    post_owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: Date
});
exports.default = mongoose_1.model('NewsFeed', NewsFeedSchema);
//# sourceMappingURL=NewsFeedSchema.js.map