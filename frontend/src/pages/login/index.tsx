import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { REGISTER } from '~/constants/routes';
import bg from '~/images/friends_meal.jpg';
import logo from '~/images/logo-white.svg';
import { loginStart } from '~/redux/action/authActions';
import { setAuthErrorMessage } from '~/redux/action/errorActions';
import { IRootReducer } from '~/types/types';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

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
        const val = e.target.value;

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
                className="relative w-7/12 h-screen p-8 flex justify-start items-end !bg-cover !bg-no-repeat !bg-center"
                style={{
                    background: `#f7f7f7 url(${bg})`
                }}
            >
                {/* --- LOGO --- */}
                <img src={logo} alt="Foodie Logo" className="w-24 absolute left-8 top-8" />
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
            <div className="animate-fade w-5/12 flex items-center justify-start relative">
                {error && (
                    <div className="py-2 w-full text-center bg-red-100 border-red-300 absolute top-0 left-0">
                        <p className="text-red-500">{error?.error?.message || 'Something went wrong :('}</p>
                    </div>
                )}
                <div className="w-full px-14">
                    <div>
                        <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
                            Login to Foodie
                    </h2>
                    </div>
                    <form
                        className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <input type="hidden" name="remember" value="true" />
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
                                    maxLength={50}
                                    className={error ? 'input--error' : ''}
                                    placeholder="Username"
                                    readOnly={isLoading}
                                    onChange={onUsernameChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className={error ? 'input--error' : ''}
                                    placeholder="Password"
                                    onChange={onPasswordChange}
                                    readOnly={isLoading}
                                    value={password}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link className="font-medium text-sm text-gray-400 hover:text-indigo-500 underline" to="/forgot-password">
                                    Forgot your password?
                            </Link>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="button--stretch" disabled={isLoading}>
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                {isLoading ? 'Logging In...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-8">
                        <Link to={REGISTER} className="underline font-medium">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
