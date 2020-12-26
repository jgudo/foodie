import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom"
import { logoutStart } from "~/redux/action/authActions";
import { IRootReducer } from "~/types/types";
import withAuth from "../hoc/withAuth";

const NavBar: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
    const dispatch = useDispatch();
    const isLoadingAuth = useSelector((state: IRootReducer) => state.loading.isLoadingAuth);

    const onLogout = () => {
        dispatch(logoutStart());
    };

    return (
        <nav className="flex justify-between align-center w-100 bg-white text-gray-700 h-60px py-2 px-20 fixed w-full">
            <ul className="flex items-center">
                <li className="logo">
                    <NavLink to="/">
                        <h2 className="text-2xl">Foodie</h2>
                    </NavLink>
                </li>
            </ul>
            {
                isAuth ? (
                    <button onClick={onLogout} disabled={isLoadingAuth}>
                        {isLoadingAuth ? 'Logging Out...' : 'Logout'}
                    </button>
                ) : (
                        <ul className="flex items-center">
                            <li className="group inline-block mx-3">
                                <NavLink to="/login" className="group-hover:text-indigo-600 text-gray-500" activeClassName="nav-active">Login</NavLink>
                            </li>
                            <li className="group inline-block mx-3">
                                <NavLink to="/register" className="group-hover:text-indigo-600 text-gray-500" activeClassName="nav-active">Create Account</NavLink>
                            </li>
                        </ul>
                    )
            }
        </nav>
    );
};

export default withAuth(NavBar);
