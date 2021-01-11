import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
    return (
        <div className="p-20 pt-40">
            <h1>Uh oh, you seemed lost.</h1>
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
