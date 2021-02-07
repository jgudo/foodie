import { IUser } from "../../schemas/UserSchema";

declare module 'express' {
    export interface Request {
        user: IUser;
        file: any;
        files: any;
        query: any;
    }
}