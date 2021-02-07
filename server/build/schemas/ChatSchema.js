"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    participants: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    lastmessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });
exports.default = mongoose_1.model('Chat', ChatSchema);
//# sourceMappingURL=ChatSchema.js.map