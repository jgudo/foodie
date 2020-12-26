import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart } from '~/redux/action/authActions';
import { IRootReducer } from '~/types/types';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const dispatch = useDispatch();
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

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setUsername(val);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email && password && username) {
            dispatch(registerStart({ email, password, username }));
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                </h2>
                    {error && (
                        <div className="p-4 w-full text-center bg-red-100 border-">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}
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
                                className={error ? 'input--error' : ''}
                                onChange={onUsernameChange}
                                autoComplete="email"
                                required
                                readOnly={isLoading}
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                className={error ? 'input--error' : ''}
                                onChange={onEmailChange}
                                autoComplete="email"
                                required
                                readOnly={isLoading}
                                placeholder="Email address"
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
                                readOnly={isLoading}
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="button--stretch" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
