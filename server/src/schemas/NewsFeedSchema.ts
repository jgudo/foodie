import { Document, model, Schema } from "mongoose";
import { IPost } from "./PostSchema";
import { IUser } from "./UserSchema";

export interface INewsFeed extends Document {
    follower: IUser['_id'];
    post: IPost['_id'];
    post_owner: IUser['_id'];
}

const NewsFeedSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    post_owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: Date
});

export default model<INewsFeed>('NewsFeed', NewsFeedSchema);
