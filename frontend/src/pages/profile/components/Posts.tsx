import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import PostItem from '~/components/main/PostItem';
import { getPosts } from "~/services/api";
import { IPost } from "~/types/types";

const Posts: React.FC<RouteComponentProps<{ username: string; }>> = ({ match }) => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const [error, setError] = useState('');
    const { username } = match.params;

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const fetchedPosts = await getPosts(username, { offset });

            setPosts([...posts, ...fetchedPosts]);
            setIsLoading(false);

            if (fetchedPosts.length !== 0) {
                setOffset(offset + 1);
            }
        } catch (e) {
            if (posts.length === 0) {
                setError(`${username} hasn't posted anything yet.`);
            } else {
                setError(e.error.message || 'Something went wrong while trying to fetch posts.');
            }

            setIsLoading(false);
        }
    };

    return (
        <div className="w-2/4">
            {!isLoading && posts.length === 0 && error ? (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{error}</h6>
                </div>
            ) : (
                    <div>
                        {posts.map(post => (
                            <PostItem
                                key={post.id}
                                post={post}
                            />
                        ))}
                        {posts.length !== 0 && !error && (
                            <div className="flex justify-center py-6">
                                <button onClick={fetchPosts} disabled={isLoading}>Load More</button>
                            </div>
                        )}
                        {(posts.length !== 0 && error) && (
                            <div className="flex justify-center py-6">
                                <p className="text-gray-400 italic">{error}</p>
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
};

export default Posts;
