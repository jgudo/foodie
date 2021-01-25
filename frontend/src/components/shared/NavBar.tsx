import { ArrowLeftOutlined, CloseOutlined, LogoutOutlined, MenuOutlined, SearchOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { LOGIN, REGISTER } from '~/constants/routes';
import useModal from "~/hooks/useModal";
import logo from '~/images/logo.svg';
import { logoutStart } from "~/redux/action/authActions";
import { IRootReducer, IUser } from "~/types/types";
import withAuth from "../hoc/withAuth";
import Messages from '../main/Messages';
import LogoutModal from "../main/Modals/LogoutModal";
import Notification from '../main/Notification';
import Avatar from "./Avatar";
import SearchInput from './SearchInput';

const NavBar: React.FC<{ isAuth: boolean; }> = ({ isAuth }) => {
    const dispatch = useDispatch();
    const { isLoadingAuth, auth, error } = useSelector((state: IRootReducer) => ({
        isLoadingAuth: state.loading.isLoadingAuth,
        auth: state.auth,
        error: state.error.authError
    }));
    const [isOpenMenu, setOpenMenu] = useState(false);
    const [isOpenSearch, setOpenSearch] = useState(false);
    const logoutModal = useModal();
    const history = useHistory();
    const { pathname } = useLocation();

    const onLogout = () => {
        dispatch(logoutStart(logoutModal.closeModal));
    };

    const hideNavToPaths = [LOGIN, REGISTER];

    const onClickMenuItem = () => {
        setOpenMenu(false);
    }

    const clickSearchItemCallback = (user: IUser) => {
        setOpenSearch(false);
        history.push(`/user/${user.username}`);
    }

    return hideNavToPaths.includes(pathname)
        ? null
        : isOpenSearch ? (
            <div className="fixed top-0 left-0 flex w-full items-center bg-indigo-700 z-9999 py-2 pr-2 shadow-xl">
                <div
                    className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500"
                    onClick={() => setOpenSearch(false)}
                >
                    <ArrowLeftOutlined className="text-white" style={{ fontSize: '18px' }} />
                </div>
                <SearchInput
                    clickItemCallback={clickSearchItemCallback}
                    inputClassName="w-full"
                />
            </div>
        ) : (
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
                        <div className="hidden laptop:block">
                            {isAuth && (
                                <SearchInput />
                            )}
                        </div>
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
                                            <h6 className="mr-10">@{auth.username}</h6>
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
                                        <NavLink to="/register" className="button group-hover:text-indigo-600" activeClassName="nav-active">
                                            Create Account
                                    </NavLink>
                                    </li>
                                </ul>
                            )
                        }
                    </div>
                    {/* ---- NAVICONS FOR MOBILE ---- */}
                    <div className="flex items-center space-x-4 laptop:hidden">
                        <div
                            className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        >
                            <Messages isAuth={isAuth} />
                        </div>
                        <div
                            className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        >
                            <Notification isAuth={isAuth} />
                        </div>
                        <div
                            className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            onClick={() => setOpenSearch(true)}
                        >
                            <SearchOutlined style={{ fontSize: '20px' }} />
                        </div>
                        <div
                            className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            onClick={() => setOpenMenu(true)}
                        >
                            <MenuOutlined style={{ fontSize: '20px' }} />
                        </div>
                    </div>
                    {/* ---- NAV DRAWER FOR MOBILE --- */}
                    <div className={`flex  flex-col w-full h-screen fixed top-0 right-0 transition-transform  transform ${isOpenMenu ? 'translate-x-0' : 'translate-x-full'} bg-white laptop:hidden`}>
                        <div className="flex items-center justify-between px-4">
                            <h1>Menu</h1>
                            <div
                                className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                                onClick={() => setOpenMenu(false)}
                            >
                                <CloseOutlined style={{ fontSize: '20px' }} />
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            <li className="px-4 py-3 pb-4 cursor-pointer hover:bg-indigo-100">
                                <Link
                                    className="flex font-medium"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}`}
                                >
                                    <Avatar url={auth.profilePicture} size="lg" className="mr-2" />
                                    <div className="flex flex-col">
                                        <span>{auth.username}</span>
                                        <span className="text-gray-400 text-xs">View Profile</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-indigo-100">
                                <Link
                                    className="flex items-center text-black"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}/following`}
                                >
                                    <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Following</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-indigo-100">
                                <Link
                                    className="flex items-center text-black"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}/followers`}
                                >
                                    <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Followers</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-indigo-100">
                                <Link
                                    className="flex items-center text-black"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}/bookmarks`}
                                >
                                    <StarOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Bookmarks</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-indigo-100">
                                <div
                                    className="flex items-center text-black"
                                    onClick={() => {
                                        logoutModal.openModal();
                                        setOpenMenu(false);
                                    }}
                                >
                                    <LogoutOutlined className="text-red-500" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm text-red-500">Logout</h6>
                                </div>
                            </li>
                        </ul>
                        {/* --- COPYRIGHT -- */}
                        <span className="text-gray-400 text-xs absolute bottom-8 left-0 right-0 mx-auto text-center">
                            &copy;Copyright {new Date().getFullYear()} Foodie
                    </span>
                    </div>
                    <LogoutModal
                        isOpen={logoutModal.isOpen}
                        closeModal={logoutModal.closeModal}
                        openModal={logoutModal.openModal}
                        dispatchLogout={onLogout}
                        error={error}
                        isLoggingOut={isLoadingAuth}
                    />
                </nav>
            );
};

export default withAuth(NavBar);
