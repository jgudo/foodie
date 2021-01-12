import { MessageOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { LOGIN, REGISTER } from '~/constants/routes';
import { logoutStart } from "~/redux/action/authActions";
import { IRootReducer } from "~/types/types";
import withAuth from "../hoc/withAuth";
import Notification from '../main/Notification';

const NavBar: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
    const dispatch = useDispatch();
    const { isLoadingAuth, auth } = useSelector((state: IRootReducer) => ({
        isLoadingAuth: state.loading.isLoadingAuth,
        auth: state.auth
    }));
    const [searchInput, setSearchInput] = useState('');
    const history = useHistory();
    const { pathname } = useLocation();

    const onLogout = () => {
        dispatch(logoutStart());
    };

    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    const onSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput) {
            history.push({
                pathname: '/search',
                search: `q=${searchInput.trim()}`
            });
        }
    }

    const hideNavToPaths = [LOGIN, REGISTER];

    return hideNavToPaths.includes(pathname) ? null : (
        <nav className="contain flex justify-between z-9999 align-center w-100 bg-white text-gray-700 h-60px py-2 fixed w-full">
            <ul className="flex items-center">
                {/* ---- LOGO -------- */}
                <li className="logo">
                    <NavLink to="/">
                        <h2 className="text-2xl">Foodie</h2>
                    </NavLink>
                </li>
                {/* -------- SEARCH BAR ------- */}
                <li className="ml-6 relative flex items-center">
                    <SearchOutlined className="text-gray-200 absolute left-3 my-auto z-10" />
                    <input
                        className="!border-gray-100 !pl-10 !py-2"
                        placeholder="Search..."
                        type="text"
                        onChange={onSearchInputChange}
                        onKeyDown={onSearchSubmit}
                    />
                </li>
            </ul>
            <div className="flex items-center">
                {/* ----- FOLLOW/MESSAGE/NOTIF ICONS ------ */}
                <ul className="flex items-center space-x-8 mr-8">
                    <li className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-200">
                        <MessageOutlined className=" text-xl" />
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
