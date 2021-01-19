import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import Boundary from "~/components/shared/Boundary";
import * as ROUTE from "~/constants/routes";
import { getUserStart } from "~/redux/action/profileActions";
import { IRootReducer } from "~/types/types";
import PageNotFound from "../error/PageNotFound";
import Sidebar from './components/Bio';
import Bookmarks from "./components/Bookmarks";
import EditInfo from "./components/EditInfo";
import Followers from "./components/Followers";
import Following from "./components/Following";
import Header from './components/Header';
import Info from "./components/Info";
import Posts from "./components/Posts";

interface MatchParams {
    username: string;
}

interface IProps extends RouteComponentProps<MatchParams> {
    children: React.ReactNode;
}

const Profile: React.FC<IProps> = (props) => {
    const dispatch = useDispatch();
    const { username } = props.match.params;
    const state = useSelector((state: IRootReducer) => ({
        profile: state.profile,
        auth: state.auth,
        error: state.error.profileError,
        isLoadingGetUser: state.loading.isLoadingGetUser
    }));

    useEffect(() => {
        if (state.profile.username !== username) {
            dispatch(getUserStart(username));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Boundary>
            {(state.error && !state.isLoadingGetUser) && (
                <PageNotFound />
            )}
            {(!state.error && !state.isLoadingGetUser) && (
                <div className="pt-14">
                    <Header
                        auth={state.auth}
                        profile={state.profile}
                    />
                    <div className="contain relative flex min-h-10rem items-start transform -translate-y-20">
                        <div className="w-1/4 mr-4 sticky top-44">
                            <Sidebar bio={state.profile.info.bio} />
                        </div>
                        <div className="w-2/4">
                            <Switch>
                                <Route exact path={ROUTE.PROFILE}>
                                    <Posts
                                        username={username}
                                        isOwnProfile={state.profile.isOwnProfile}
                                        auth={state.auth}
                                    />
                                </Route>
                                <Route path={ROUTE.PROFILE_FOLLOWERS}>
                                    <Followers username={username} />
                                </Route>
                                <Route path={ROUTE.PROFILE_FOLLOWING}>
                                    <Following username={username} />
                                </Route>
                                <Route path={ROUTE.PROFILE_BOOKMARKS}>
                                    <Bookmarks username={username} isOwnProfile={state.profile.isOwnProfile} />
                                </Route>
                                <Route path={ROUTE.PROFILE_INFO}>
                                    <Info />
                                </Route>
                                <Route path={ROUTE.PROFILE_EDIT_INFO}>
                                    <EditInfo isOwnProfile={state.profile.isOwnProfile} profile={state.profile} />
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </div>
            )}
        </Boundary>
    );
};

export default Profile;
