import { Document, model, Schema } from "mongoose";
import { IPost } from "./PostSchema";
import { IUser } from "./UserSchema";

export interface ILike extends Document {
    _post_id: IPost['_id'];
    _author_id: IUser['_id'];
}

const LikeSchema = new Schema({
    _post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    _author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

LikeSchema.virtual('post', {
    ref: 'Post',
    localField: '_post_id',
    foreignField: '_id',
    justOne: true
});

export default model<ILike>('Like', LikeSchema);
