import { IUser } from "@/schemas/UserSchema";

interface IResponseStatus {
    status_code: number;
    success: Boolean;
    data: any;
    error: any;
    timestamp: string | Date;
}

const initStatus: IResponseStatus = {
    status_code: 404,
    success: false,
    data: null,
    error: null,
    timestamp: null
};

const sessionizeUser = (user: Partial<IUser>) => ({
    id: user._id,
    username: user.username,
    fullname: user.fullname,
    profilePicture: user.profilePicture
})

const makeResponseJson = (data: any, success = true) => {
    return {
        ...initStatus,
        status_code: 200,
        success,
        data,
        timestamp: new Date()
    };
}

export { sessionizeUser, makeResponseJson };

