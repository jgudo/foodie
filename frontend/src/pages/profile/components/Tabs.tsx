import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    followersCount: number;
    followingCount: number;
    username: string;
    isOwnProfile: boolean;
}

const linkStyleName = `
    text-lg font-medium text-gray-500 hover:bg-gray-200 
    hover:text-gray-800 rounded-t-md cursor-pointer px-4 py-2
    border-b-4 border-transparent hover:border-indigo-400
`;

const Tabs: React.FC<IProps> = ({ username, isOwnProfile, followersCount, followingCount }) => {
    const { pathname } = useLocation();
    const [activeNav, setActiveNav] = useState('');

    useEffect(() => {
        const splitPath = pathname.split('/');
        const currentNav = splitPath[splitPath.length - 1];

        setActiveNav(currentNav);
    }, [pathname]);

    return (
        <ul className="flex items-center space-x-4">
            <li>
                <Link
                    to={`/user/${username}/`}
                    className={`${linkStyleName} ${(activeNav === username || activeNav === '') && 'border-indigo-700  border-b-4'}`}
                >
                    Posts
                </Link>
            </li>
            <li>
                <Link
                    to={`/user/${username}/info`}
                    className={`${linkStyleName} ${activeNav === 'info' && 'border-indigo-700  border-b-4'}`}
                >
                    Info
                </Link>
            </li>
            <li>
                <Link
                    to={`/user/${username}/followers`}
                    className={`${linkStyleName} ${activeNav === 'followers' && 'border-indigo-700 border-b-4'}`}
                >
                    <span className="text-lg text-indigo-700">{followersCount}</span>
                            &nbsp;&nbsp;
                            <span>Followers</span>
                </Link>
            </li>
            <li>
                <Link
                    to={`/user/${username}/following`}
                    className={`${linkStyleName} ${activeNav === 'following' && 'border-indigo-700 border-b-4'}`}
                >
                    <span className="text-lg text-indigo-700">{followingCount}</span>
                            &nbsp;&nbsp;
                            <span>Following</span>
                </Link>
            </li>
            {isOwnProfile && (
                <li>
                    <Link
                        to={`/user/${username}/bookmarks`}
                        className={`${linkStyleName} ${activeNav === 'bookmarks' && 'border-indigo-700 border-b-4'}`}
                    >
                        Bookmarks
                </Link>
                </li>
            )}
        </ul>
    );
};

export default Tabs;
