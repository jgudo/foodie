import { Document, model, Schema } from "mongoose";
import { IUser } from "./UserSchema";

export interface IMessage extends Document {
    from: IUser['_id'];
    to: IUser['_id'];
    text: string;
    seen: boolean;
    createdAt: string | number;
}

const MessageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
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

export default model<IMessage>('Message', MessageSchema);
