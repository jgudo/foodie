import { GET_USER_SUCCESS, UPDATE_PROFILE_INFO } from "~/constants/actionType";
import { IProfile } from "~/types/types";
import { TProfileActionTypes } from "../action/profileActions";

const initState: IProfile = {
    _id: '',
    id: '',
    username: '',
    email: '',
    fullname: '',
    firstname: '',
    lastname: '',
    info: {
        bio: '',
        birthday: '',
        gender: 'unspecified',
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
        case UPDATE_PROFILE_INFO:
            const { payload: user } = action;
            return {
                ...state,
                fullname: user.fullname,
                firstname: user.firstname,
                lastname: user.lastname,
                info: user.info
            }
        default:
            return state;
    }
};

export default profileReducer;
