import { Document, model, Schema } from "mongoose";
import { IUser } from "./UserSchema";

export interface IFollow extends Document {
    _user_id: IUser['_id'];
    following: Array<IUser['_id']>;
    followers: Array<IUser['_id']>;
}

const FollowSchema = new Schema({
    _user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

export default model<IFollow>('Follow', FollowSchema);
