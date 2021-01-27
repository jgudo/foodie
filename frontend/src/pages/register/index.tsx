import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SocialLogin from '~/components/shared/SocialLogin';
import { LOGIN } from '~/constants/routes';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import bg from '~/images/friends_meal_2.webp';
import logo from '~/images/logo-white.svg';
import logo_dark from '~/images/logo.svg';
import { registerStart } from '~/redux/action/authActions';
import { setAuthErrorMessage } from '~/redux/action/errorActions';
import { IRootReducer } from '~/types/types';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();

    useDocumentTitle('Register to Foodie');
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

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();

        setEmail(val.toLowerCase());
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();

        setPassword(val);
    };

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();

        setUsername(val.toLowerCase());
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email && password && username) {
            dispatch(registerStart({ email, password, username }));
        }
    };
    return (
        <div className="min-h-screen flex bg-white">
            <div
                className="relative hidden laptop:w-7/12 h-screen laptop:p-8 laptop:flex laptop:justify-start laptop:items-end !bg-cover !bg-no-repeat !bg-center"
                style={{
                    background: `#f7f7f7 url(${bg})`
                }}
            >
                {/* --- LOGO --- */}
                <img src={logo} alt="Foodie Logo" className="w-24 absolute left-8 top-8" />
                {/* -- INFO --- */}
                <h3 className="animate-fade text-white w-9/12 mb-14">
                    Create your account now and discover new ideas and connect with people.
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
            <div className="relative animate-fade w-full text-center laptop:w-5/12 laptop:text-left flex items-center justify-start">
                <img
                    src={logo_dark}
                    alt="Foodie Logo"
                    className="w-24 absolute left-0 right-0 mx-auto top-8 laptop:hidden"
                />
                {error && (
                    <div className="p-4 w-full text-center bg-red-100 border-red-400 absolute top-0 left-0">
                        <p className="text-red-500 text-sm">{error?.error?.message || 'Something went wrong :('}</p>
                    </div>
                )}
                <div className="w-full px-8 laptop:px-14">
                    <div>
                        <h2 className="mt-6 text-xl laptop:text-2xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm space-y-2">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className={`lowercase ${error ? 'input--error' : ''}`}
                                    onChange={onUsernameChange}
                                    autoComplete="username"
                                    maxLength={30}
                                    required
                                    readOnly={isLoading}
                                    placeholder="Username eg: john23 | john_23"
                                    value={username}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    className={`lowercase ${error ? 'input--error' : ''}`}
                                    onChange={onEmailChange}
                                    autoComplete="email"
                                    maxLength={64}
                                    required
                                    readOnly={isLoading}
                                    placeholder="Email eg: john@example.com"
                                    value={email}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={error ? 'input--error' : ''}
                                    onChange={onPasswordChange}
                                    autoComplete="current-password"
                                    required
                                    minLength={8}
                                    maxLength={100}
                                    readOnly={isLoading}
                                    placeholder="Password"
                                    value={password}
                                />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="button--stretch" disabled={isLoading}>
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                        <i className="social-login-divider">OR</i>
                        <div className="flex justify-between space-x-2">
                            <SocialLogin isLoading={isLoading} />
                        </div>
                    </form>
                    <div className="text-center mt-8">
                        <Link to={LOGIN} className="underline font-medium">Login instead</Link>
                    </div>
                    {/* --- COPYRIGHT -- */}
                    <span className="text-gray-400 text-xs absolute bottom-8 left-0 right-0 mx-auto text-center">
                        &copy;Copyright {new Date().getFullYear()} Foodie
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
