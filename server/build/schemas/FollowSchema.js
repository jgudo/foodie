"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FollowSchema = new mongoose_1.Schema({
    _user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    followers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });
exports.default = mongoose_1.model('Follow', FollowSchema);
//# sourceMappingURL=FollowSchema.js.map