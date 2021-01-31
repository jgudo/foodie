import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LOGIN, REGISTER } from '~/constants/routes';
import useModal from "~/hooks/useModal";
import logo from '~/images/logo.svg';
import { logoutStart } from "~/redux/action/authActions";
import { IRootReducer } from "~/types/types";
import withAuth from "../hoc/withAuth";
import Messages from '../main/Messages';
import LogoutModal from "../main/Modals/LogoutModal";
import Notification from '../main/Notification';
import Avatar from "./Avatar";
import SearchInput from './SearchInput';

const NavBarMobile = lazy(() => import('./NavBarMobile'));

const NavBar: React.FC<{ isAuth: boolean; }> = ({ isAuth }) => {
    const dispatch = useDispatch();
    const { isLoadingAuth, auth, error } = useSelector((state: IRootReducer) => ({
        isLoadingAuth: state.loading.isLoadingAuth,
        auth: state.auth,
        error: state.error.authError
    }));
    const logoutModal = useModal();
    const { pathname } = useLocation();
    const isLaptop = window.screen.width >= 1024;

    const onLogout = () => {
        dispatch(logoutStart(logoutModal.closeModal));
    };

    const hideNavToPaths = [LOGIN, REGISTER];

    return hideNavToPaths.includes(pathname)
        ? null
        : (
            <>
                {isLaptop ? (
                    <nav className="contain flex justify-between z-9999 align-center w-100 bg-white text-gray-700 h-60px py-2 fixed w-full shadow-md laptop:shadow-sm">
                        <div className="flex items-center space-x-8">
                            {/* ---- LOGO -------- */}
                            <NavLink
                                to={{
                                    pathname: '/',
                                    state: { from: pathname }
                                }}
                            >
                                <img src={logo} alt="" className="w-24" />
                            </NavLink>
                            {/* -------- SEARCH BAR ------- */}
                            <SearchInput />
                        </div>
                        <div className="hidden laptop:flex laptop:items-center">
                            {isAuth ? (
                                <>
                                    {/* ----- FOLLOW/MESSAGE/NOTIF ICONS ------ */}
                                    <ul className="flex items-center space-x-8 mr-8">
                                        <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200">
                                            <Messages isAuth={isAuth} />
                                        </li>
                                        <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200">
                                            <Notification isAuth={isAuth} />
                                        </li>
                                    </ul>
                                    <div className="flex items-center">
                                        {/* ---- AVATAR WITH  USERNAME ----------- */}
                                        <Link to={`/user/${auth.username}`} className="cursor-pointer">
                                            <div className="flex items-center">
                                                <Avatar url={auth.profilePicture} className="mr-2" />
                                                <h6 className="text-sm mr-10">@{auth.username}</h6>
                                            </div>
                                        </Link>
                                        {/* ----- LOGOUT BUTTON ------ */}
                                        <button
                                            className="button--muted"
                                            onClick={logoutModal.openModal}
                                            disabled={isLoadingAuth}
                                        >
                                            Logout
                            </button>
                                    </div>
                                </>
                            ) : (
                                    <ul className="flex items-center">
                                        <li className="group inline-block mx-3">
                                            <NavLink to="/login" className="group-hover:text-indigo-600 text-gray-500" activeClassName="nav-active">Login</NavLink>
                                        </li>
                                        <li className="group inline-block mx-3">
                                            <NavLink to="/register" className="button py-1 group-hover:text-indigo-600" activeClassName="nav-active">
                                                Register
                                    </NavLink>
                                        </li>
                                    </ul>
                                )
                            }
                        </div>
                    </nav>
                ) : (
                        <Suspense fallback={<nav className="bg-white h-60px fixed top-0 left-0 w-full shadow-md"></nav>}>
                            <NavBarMobile
                                isAuth={isAuth}
                                auth={auth}
                                openModal={logoutModal.openModal}
                            />
                        </Suspense>
                    )}
                <LogoutModal
                    isOpen={logoutModal.isOpen}
                    closeModal={logoutModal.closeModal}
                    openModal={logoutModal.openModal}
                    dispatchLogout={onLogout}
                    error={error}
                    isLoggingOut={isLoadingAuth}
                />
            </>
        )
};

export default withAuth(NavBar);
