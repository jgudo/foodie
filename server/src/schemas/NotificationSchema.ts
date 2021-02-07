import { Document, model, Schema } from "mongoose";
import { IUser } from "./UserSchema";

export enum ENotificationType {
    follow = 'follow',
    like = 'like',
    comment = 'comment'
}

interface INotificationDocument extends Document {
    type: ENotificationType;
    initiator: IUser['_id'];
    target: IUser['_id'];
    unread: boolean;
    link: string;
    createdAt: string | number;
}

const NotificationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['follow', 'like', 'comment'],
    },
    initiator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true,
        getters: true
    }
});

const Notification = model<INotificationDocument>('Notification', NotificationSchema);

export default Notification;
