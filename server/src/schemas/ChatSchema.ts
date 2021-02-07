import { Document, model, Schema } from "mongoose";
import { IMessage } from "./MessageSchema";
import { IUser } from "./UserSchema";

export interface IChat extends Document {
    participants: Array<IUser['_id']>;
    lastmessage: IMessage['_id'];
}

const ChatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastmessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

export default model<IChat>('Chat', ChatSchema);
