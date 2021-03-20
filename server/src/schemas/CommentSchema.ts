import { Document, model, Schema } from "mongoose";
import { IPost } from "./PostSchema";
import { IUser } from "./UserSchema";

export interface IComment extends Document {
    _post_id: IPost['_id'];
    body: string;
    _author_id: IUser['_id'];
    depth: number;
    parent: IComment['id'];
    parents: IComment['id'][];
    isEdited: boolean;
    createdAt: number | Date;
    updatedAt: number | Date;
}

const options = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.parents;
            return ret;
        }
    },
    toObject: {
        getters: true,
        virtuals: true,
        transform: function (doc, ret, opt) {
            delete ret.parents;
            return ret;
        }
    }
}

const CommentSchema = new Schema({
    _post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    parents: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    depth: {
        type: Number,
        default: 1
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
}, options);

CommentSchema.virtual('author', {
    ref: 'User',
    localField: '_author_id',
    foreignField: '_id',
    justOne: true
});

export default model<IComment>('Comment', CommentSchema);
