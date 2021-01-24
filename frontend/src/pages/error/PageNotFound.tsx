import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '~/hooks/useDocumentTitle';

const PageNotFound: React.FC = () => {
    useDocumentTitle('Page Not Found');

    return (
        <div className="p-4 laptop:p-20 pt-40">
            <h1 className="text-xl mb-2 laptop:text-4xl">Uh oh, you seemed lost.</h1>
            <p>The page you're trying to visit doesn't exist.</p>
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
