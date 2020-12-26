import React from 'react';

const PageNotFound: React.FC = () => {
    return (
        <div className="p-20 pt-40">
            <h1 className="text-indigo-700">Uh oh, you seemed lost.</h1>
            <p>The page you're trying to visit doesn't exist.</p>
        </div>
    );
};

export default PageNotFound;
