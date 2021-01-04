import { GET_USER_SUCCESS } from "~/constants/actionType";
import { IProfile } from "~/types/types";
import { TProfileActionTypes } from "../action/profileActions";

const initState: IProfile = {
    id: '',
    username: '',
    email: '',
    fullname: '',
    firstname: '',
    lastname: '',
    info: {
        bio: '',
        birthday: null
    },
    isEmailValidated: false,
    profilePicture: null,
    coverPhoto: null,
    followersCount: 0,
    followingCount: 0,
    dateJoined: null
};

const profileReducer = (state = initState, action: TProfileActionTypes) => {
    switch (action.type) {
        case GET_USER_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export default profileReducer;
