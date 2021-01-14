import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LOGIN, REGISTER } from '~/constants/routes';
import { logoutStart } from "~/redux/action/authActions";
import { IRootReducer } from "~/types/types";
import withAuth from "../hoc/withAuth";
import Messages from '../main/Messages';
import Notification from '../main/Notification';
import SearchInput from './SearchInput';

const NavBar: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
    const dispatch = useDispatch();
    const { isLoadingAuth, auth } = useSelector((state: IRootReducer) => ({
        isLoadingAuth: state.loading.isLoadingAuth,
        auth: state.auth
    }));
    const { pathname } = useLocation();

    const onLogout = () => {
        dispatch(logoutStart());
    };

    const hideNavToPaths = [LOGIN, REGISTER];

    return hideNavToPaths.includes(pathname) ? null : (
        <nav className="contain flex justify-between z-9999 align-center w-100 bg-white text-gray-700 h-60px py-2 fixed w-full">
            <div className="flex items-center space-x-8">
                {/* ---- LOGO -------- */}
                <NavLink
                    to={{
                        pathname: '/',
                        state: { from: pathname }
                    }}
                >
                    <h2 className="text-2xl">Foodie</h2>
                </NavLink>
                {/* -------- SEARCH BAR ------- */}
                <SearchInput />
            </div>
            <div className="flex items-center">
                {/* ----- FOLLOW/MESSAGE/NOTIF ICONS ------ */}
                <ul className="flex items-center space-x-8 mr-8">
                    <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200">
                        <Messages />
                    </li>
                    <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200">
                        <Notification />
                    </li>
                </ul>
                {
                    isAuth ? (
                        <div className="flex items-center">
                            {/* ---- AVATAR WITH  USERNAME ----------- */}
                            <Link to={`/user/${auth.username}`} className="cursor-pointer">
                                <div className="flex items-center">
                                    <div
                                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                                        style={{ background: `#f8f8f8 url(${auth.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                                    />
                                    <h6 className="mr-10">@{auth.username}</h6>
                                </div>
                            </Link>
                            {/* ----- LOGOUT BUTTON ------ */}
                            <button className="button--muted" onClick={onLogout} disabled={isLoadingAuth}>
                                {isLoadingAuth ? 'Logging Out...' : 'Logout'}
                            </button>
                        </div>
                    ) : (
                            <ul className="flex items-center">
                                <li className="group inline-block mx-3">
                                    <NavLink to="/login" className="group-hover:text-indigo-600 text-gray-500" activeClassName="nav-active">Login</NavLink>
                                </li>
                                <li className="group inline-block mx-3">
                                    <NavLink to="/register" className="button group-hover:text-indigo-600 text-gray-500" activeClassName="nav-active">
                                        Create Account
                                    </NavLink>
                                </li>
                            </ul>
                        )
                }
            </div>
        </nav>
    );
};

export default withAuth(NavBar);
