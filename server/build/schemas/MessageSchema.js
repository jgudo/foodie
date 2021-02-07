"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });
exports.default = mongoose_1.model('Message', MessageSchema);
//# sourceMappingURL=MessageSchema.js.map