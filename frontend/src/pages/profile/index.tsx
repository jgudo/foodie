import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getUserStart } from "~/redux/action/profileActions";
import { IRootReducer } from "~/types/types";
import Header from './components/Header';

const Profile: React.FC<RouteComponentProps<{ username: string }>> = (props) => {
    const dispatch = useDispatch();
    const { username } = props.match.params;
    const { profile, isLoadingGetUser } = useSelector((state: IRootReducer) => ({
        profile: state.profile,
        isLoadingGetUser: state.loading.isLoadingGetUser
    }));

    useEffect(() => {
        dispatch(getUserStart(username));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header
                profile={profile}
                isLoadingGetUser={isLoadingGetUser}
            />
        </>
    );
};

export default Profile;
