import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { Boundary, ProfileLoader } from "~/components/shared";
import * as ROUTE from "~/constants/routes";
import { PageNotFound } from "~/pages";
import { getUserStart } from "~/redux/action/profileActions";
import { IRootReducer } from "~/types/types";
import Header from './Header';
import * as Tab from './Tabs';

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
            {(state.isLoadingGetUser) && (
                <div className="pt-14"><ProfileLoader /></div>
            )}
            {(!state.error && !state.isLoadingGetUser && state.profile.id) && (
                <div className="pt-14">
                    <Header
                        auth={state.auth}
                        profile={state.profile}
                    />
                    <div className="laptop:px-6% relative flex min-h-10rem  items-start transform laptop:-translate-y-24">
                        <div className="hidden laptop:block laptop:w-1/4 laptop:mr-4 laptop:sticky laptop:top-44">
                            <Tab.Bio
                                bio={state.profile.info.bio}
                                dateJoined={state.profile.dateJoined}
                            />
                        </div>
                        <div className="w-full laptop:w-2/4 mb-14">
                            <Switch>
                                <Route exact path={ROUTE.PROFILE}>
                                    <Tab.Posts
                                        username={username}
                                        isOwnProfile={state.profile.isOwnProfile}
                                        auth={state.auth}
                                    />
                                </Route>
                                <Route path={ROUTE.PROFILE_FOLLOWERS}>
                                    <Tab.Followers username={username} />
                                </Route>
                                <Route path={ROUTE.PROFILE_FOLLOWING}>
                                    <Tab.Following username={username} />
                                </Route>
                                <Route path={ROUTE.PROFILE_BOOKMARKS}>
                                    <Tab.Bookmarks username={username} isOwnProfile={state.profile.isOwnProfile} />
                                </Route>
                                <Route path={ROUTE.PROFILE_INFO}>
                                    <Tab.Info />
                                </Route>
                                <Route path={ROUTE.PROFILE_EDIT_INFO}>
                                    <Tab.EditInfo isOwnProfile={state.profile.isOwnProfile} profile={state.profile} />
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
