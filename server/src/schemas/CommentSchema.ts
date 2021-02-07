import { Document, model, Schema } from "mongoose";
import { IPost } from "./PostSchema";
import { IUser } from "./UserSchema";

export interface IComment extends Document {
    _post_id: IPost['_id'];
    body: string;
    _author_id: IUser['_id'];
    isEdited: boolean;
    createdAt: number | Date;
    updatedAt: number | Date;
}

const CommentSchema = new Schema({
    _post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: String,
    _author_id: {
        type: Schema.Types.ObjectId,
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

export default model<IComment>('Comment', CommentSchema);
