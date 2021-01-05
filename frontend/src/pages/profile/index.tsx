import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Boundary from "~/components/shared/Boundary";
import { getUserStart } from "~/redux/action/profileActions";
import { IRootReducer } from "~/types/types";
import Sidebar from './components/Bio';
import Header from './components/Header';

interface MatchParams {
    username: string;
}

interface IProps extends RouteComponentProps<MatchParams> {
    children: React.ReactNode;
}

const Profile: React.FC<IProps> = (props) => {
    const dispatch = useDispatch();
    const { username } = props.match.params;
    const { profile, isLoadingGetUser, auth, error } = useSelector((state: IRootReducer) => ({
        profile: state.profile,
        auth: state.auth,
        error: state.error.profileError,
        isLoadingGetUser: state.loading.isLoadingGetUser
    }));

    useEffect(() => {
        dispatch(getUserStart(username));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Boundary>
            {(error && !isLoadingGetUser) ? (
                <div className="w-full flex flex-col justify-center items-center pt-20 h-screen">
                    <h1>Something went wrong :(</h1>
                    <p>Please try again.</p>
                    <br />
                    <button onClick={() => dispatch(getUserStart(username))}>
                        Try again
                    </button>
                </div>
            ) : (
                    <div className="pt-14">
                        <Header
                            auth={auth}
                            profile={profile}
                            isLoadingGetUser={isLoadingGetUser}
                        />
                        <div className="relative flex items-start px-14 transform -translate-y-24">
                            <div className="w-1/4 mr-4 sticky top-44">
                                <Sidebar bio={profile.info.bio} />
                            </div>
                            {props.children}
                        </div>
                    </div>
                )}
        </Boundary>
    );
};

export default withRouter(Profile);
