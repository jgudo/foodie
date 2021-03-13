import { IUser } from "@/schemas/UserSchema";
import Filter from 'bad-words';

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

const newBadWords = [
    'gago', 'puta', 'animal', 'porn', 'amputa', 'tangina', 'pota', 'puta', 'putangina'
];

const filterWords = new Filter();
filterWords.addWords(...newBadWords);

export { sessionizeUser, makeResponseJson, filterWords };

