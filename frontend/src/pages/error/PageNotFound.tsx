import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '~/hooks';

const PageNotFound: React.FC = () => {
    useDocumentTitle('Page Not Found');

    return (
        <div className="p-4 laptop:p-20 pt-40 h-screen flex items-start laptop:justify-center flex-col">
            <h1 className="text-xl mb-2 laptop:text-4xl dark:text-white">Uh oh, you seemed lost.</h1>
            <p className="dark:text-gray-400">The page you're trying to visit doesn't exist.</p>
            <br />
            <Link
                className="button inline-flex"
                to={'/'}
            >
                Go to News Feed
            </Link>
        </div>
    );
};

export default PageNotFound;
