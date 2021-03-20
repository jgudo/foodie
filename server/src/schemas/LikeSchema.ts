import { Document, model, Schema } from "mongoose";
import { IPost } from "./PostSchema";
import { IUser } from "./UserSchema";

export interface ILike extends Document {
    target: IPost['_id'];
    user: IUser['_id'];
}

const LikeSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    },
    target: {
        type: Schema.Types.ObjectId,
        refPath: 'type',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

export default model<ILike>('Like', LikeSchema);
