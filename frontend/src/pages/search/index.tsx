import { useEffect, useState } from "react";
import { Redirect, RouteComponentProps, useLocation } from "react-router-dom";
import Loader from "~/components/shared/Loader";
import { search } from "~/services/api";
import { IPost, IProfile } from "~/types/types";
import Posts from "./Posts";
import Users from "./Users";


const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Search: React.FC<RouteComponentProps> = ({ history }) => {
    const [users, setUsers] = useState<IProfile[]>([]);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [error, setError] = useState('');
    const [userOffset, setUserOffset] = useState(0);
    const [postOffset, setPostOffset] = useState(0);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [isLoadingPost, setIsLoadingPost] = useState(false);
    const query = useQuery();
    const searchQuery = query.get('q');
    const searchType = query.get('type');

    useEffect(() => {
        if (searchType === 'posts') {
            dispatchSearchPosts();
        } else {
            dispatchSearchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchType, searchQuery]);

    const dispatchSearchPosts = async () => {
        try {
            if (searchQuery && searchType) {
                setIsLoadingPost(true);
                setError('');
                const fetchedPosts = await search({ q: searchQuery, type: searchType, offset: postOffset });

                setPosts(fetchedPosts);
                setIsLoadingPost(false);

                if (fetchedPosts.length === 0) {
                    setError('No posts found.');
                }
            }
        } catch (e) {
            setIsLoadingPost(false);
            setError(e.error.message);
        }
    }

    const dispatchSearchUsers = async () => {
        try {
            if (searchQuery) {
                setError('');
                setIsLoadingUser(true);
                const fetchedUsers = await search({ q: searchQuery, offset: userOffset });

                setUsers(fetchedUsers);
                setIsLoadingUser(false);

                if (fetchedUsers.length === 0) {
                    setError('No users found.');
                }
            }
        } catch (e) {
            setIsLoadingUser(false);
            setError(e.error.message);
        }
    }

    const onClickUserTab = () => {
        history.push(`/search?q=${searchQuery}`)
    }

    const onClickPostTab = () => {
        history.push(`/search?q=${searchQuery}&type=posts`)
    }

    return !searchQuery ? <Redirect to={'/'} /> : (
        <div className="min-h-screen pt-20">
            <div className="contain">
                <h2>{searchQuery}</h2>
                <span className="text-gray-400">Search Result</span>
                <ul className="space-x-4 mt-4">
                    <li
                        className={`inline-block px-2 py-4 cursor-pointer font-medium ${searchType !== 'posts' && 'border-b-4 border-indigo-700'}`}
                        onClick={onClickUserTab}
                    >
                        Users
                    </li>
                    <li
                        className={`inline-block px-2 py-4 cursor-pointer font-medium ${searchType === 'posts' && 'border-b-4 border-indigo-700'}`}
                        onClick={onClickPostTab}
                    >
                        Posts
                    </li>
                </ul>
            </div>
            <div className="contain bg-gray-200 py-8">
                <div className="w-3/4">
                    {searchType === 'posts' ? (
                        <>
                            {(isLoadingPost && posts.length === 0) && (
                                <div className="p-4 flex items-center justify-center">
                                    <Loader />
                                </div>
                            )}
                            {(!isLoadingPost && posts.length === 0 && error) && (
                                <div className="p-4 flex items-center justify-center">
                                    <span className="text-gray-400 italic font-medium">{error}</span>
                                </div>
                            )}
                            {(!isLoadingPost && !error && posts.length !== 0) && <Posts posts={posts} />}
                        </>
                    ) : (
                            <>
                                {(isLoadingUser && users.length === 0) && (
                                    <div className="p-4 flex items-center justify-center">
                                        <Loader />
                                    </div>
                                )}
                                {(!isLoadingUser && users.length === 0 && error) && (
                                    <div className="p-4 flex items-center justify-center">
                                        <span className="text-gray-400 italic font-medium">{error}</span>
                                    </div>
                                )}
                                {(!isLoadingUser && !error && users.length !== 0) && <Users users={users} />}
                            </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default Search;
