import { EyeInvisibleOutlined, EyeOutlined, LockFilled } from '@ant-design/icons';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SocialLogin } from '~/components/shared';
import { REGISTER } from '~/constants/routes';
import { useDocumentTitle } from '~/hooks';
import bg from '~/images/friends_meal.jpg';
import logo from '~/images/logo-white.svg';
import logo_dark from '~/images/logo.svg';
import { loginStart } from '~/redux/action/authActions';
import { setAuthErrorMessage } from '~/redux/action/errorActions';
import { IRootReducer } from '~/types/types';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const dispatch = useDispatch();

    useDocumentTitle('Login to Foodie');
    useEffect(() => {
        return () => {
            dispatch(setAuthErrorMessage(null));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { error, isLoading } = useSelector((state: IRootReducer) => ({
        error: state.error.authError,
        isLoading: state.loading.isLoadingAuth
    }));

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();

        setUsername(val);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setPassword(val);
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (username && password) {
            dispatch(loginStart(username, password));
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div
                className="relative laptop:w-7/12 h-screen laptop:p-8 hidden laptop:justify-start laptop:items-end laptop:!bg-cover laptop:!bg-no-repeat laptop:!bg-center laptop:flex"
                style={{
                    background: `#f7f7f7 url(${bg})`
                }}
            >
                {/* --- LOGO --- */}
                <Link className="absolute left-8 top-8" to="/">
                    <img src={logo} alt="Foodie Logo" className="w-24" />
                </Link>
                {/* -- INFO --- */}
                <h3 className="animate-fade text-white w-9/12 mb-14">
                    Looking for a new idea for your next menu? You're in the right place.
                </h3>
                {/* --- CREDITS LINK --- */}
                <a
                    className="animate-fade absolute bottom-8 left-8 text-1xs text-white underline"
                    target="_blank"
                    rel="noreferrer"
                    href="https://infinityrimapts.com/5-reasons-host-dinner-party/friends-enjoying-a-meal/"
                >
                    Photo: Credits to the photo owner
                </a>
            </div>
            <div className="animate-fade laptop:w-5/12 w-full flex items-center flex-col justify-center pt-8 laptop:pt-0 relative">
                <Link to="/">
                    <img
                        src={logo_dark}
                        alt="Foodie Logo"
                        className="w-24 relative mx-auto laptop:hidden"
                    />
                </Link>
                {error && (
                    <div className="py-2 w-full text-center bg-red-100 border-red-300 absolute top-0 left-0">
                        <p className="text-red-500">{error?.error?.message || 'Something went wrong :('}</p>
                    </div>
                )}
                <div className="w-full laptop:px-14 px-8 text-center laptop:text-left">
                    <div>
                        <h2 className="mt-6 text-xl laptop:text-2xl font-extrabold text-gray-900">
                            Login to Foodie
                    </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-2">
                                <label htmlFor="username" className="sr-only">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={username}
                                    required
                                    maxLength={30}
                                    className={`text-center ${error ? 'input--error' : ''} laptop:text-left`}
                                    placeholder="Username"
                                    readOnly={isLoading}
                                    onChange={onUsernameChange}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className={`text-center !pr-12 ${error ? 'input--error' : ''} laptop:text-left`}
                                    placeholder="Password"
                                    minLength={8}
                                    maxLength={100}
                                    onChange={onPasswordChange}
                                    readOnly={isLoading}
                                    value={password}
                                />
                                <div className="absolute right-0 top-0 bottom-0 my-auto flex items-center justify-center w-12 h-12 hover:bg-gray-200 cursor-pointer rounded-tr-full rounded-br-full z-10">
                                    {isPasswordVisible ? (
                                        <EyeInvisibleOutlined
                                            className="h-full w-full outline-none text-gray-500"
                                            onClick={() => setPasswordVisible(false)}
                                        />
                                    ) : (
                                        <EyeOutlined
                                            className="h-full w-full outline-none"
                                            onClick={() => setPasswordVisible(true)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link className="font-medium text-sm text-gray-400 inline-block laptop:block my-4  laptop:mb-0 hover:text-indigo-500 underline laptop:w-2/4 laptop:pl-4" to="/forgot-password">
                            Forgot your password?
                            </Link>
                        <button type="submit" className="button--stretch" disabled={isLoading}>
                            <LockFilled className="absolute left-8 top-0 bottom-0 my-auto" />
                            {isLoading ? 'Logging In...' : 'Login'}
                        </button>
                        {/* -- TOO HARD TO REPLICATE PSEUDO IN TAILWIND :() */}
                        <i className="social-login-divider">OR</i>
                        <div className="flex justify-between space-x-2">
                            <SocialLogin isLoading={isLoading} />
                        </div>
                    </form>
                    <div className="text-center mt-8">
                        <Link
                            className="underline font-medium"
                            onClick={(e) => isLoading && e.preventDefault()}
                            to={REGISTER}
                        >
                            I dont have an account
                        </Link>
                    </div>
                    {/* --- COPYRIGHT -- */}
                    <span className="text-gray-400 text-xs mx-auto text-center block mt-4">
                        &copy;Copyright {new Date().getFullYear()} Foodie
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
