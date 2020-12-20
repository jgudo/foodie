import { LOGIN_SUCCESS } from '~/constants/actionType';
import { TAuthActionType } from '~/redux/action/authActions';
import { IAuth } from '~/types/types';

const initState: IAuth = {
    id: null,
    username: null
}

const authReducer = (state = initState, action: TAuthActionType) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export default authReducer;
