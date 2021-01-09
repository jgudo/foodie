import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { REGISTER } from '~/constants/routes';
import { loginStart } from '~/redux/action/authActions';
import { setAuthErrorMessage } from '~/redux/action/errorActions';
import { IRootReducer } from '~/types/types';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setAuthErrorMessage(''));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { error, isLoading } = useSelector((state: IRootReducer) => ({
        error: state.error.authError,
        isLoading: state.loading.isLoadingAuth
    }));

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setEmail(val);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setPassword(val);
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (email && password) {
            dispatch(loginStart(email, password));
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div
                className="w-2/5 h-screen !bg-cover !bg-no-repeat !bg-center"
                style={{
                    background: `#f7f7f7 url(https://source.unsplash.com/500x400/?food?${new Date().getTime()})`
                }}

            />
            <div className="w-3/5 flex items-center justify-start relative">
                {error && (
                    <div className="py-2 w-full text-center bg-red-100 border-red-300 absolute top-0 left-0">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
                <div className="w-full px-20%">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Login to Foodie
                    </h2>
                    </div>
                    <form
                        className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-2">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    required
                                    className={error ? 'input--error' : ''}
                                    placeholder="Email address"
                                    readOnly={isLoading}
                                    onChange={onEmailChange}
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
                                    Login
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
