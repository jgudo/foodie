import { useEffect, useRef, useState } from "react";
import PostItem from '~/components/main/PostItem';
import Loader from "~/components/shared/Loader";
import { getPosts } from "~/services/api";
import { IPost } from "~/types/types";

interface IProps {
    username: string;
}

const Posts: React.FC<IProps> = ({ username }) => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const [error, setError] = useState('');

    let isMountedRef = useRef<boolean | null>(null);

    useEffect(() => {
        fetchPosts();

        if (isMountedRef) isMountedRef.current = true;

        return () => {
            if (isMountedRef) isMountedRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const likeCallback = (post: IPost) => {
        updatePostState(post);
    };

    const updateSuccessCallback = (post: IPost) => {
        updatePostState(post);
    }

    const deleteSuccessCallback = (postID: string) => {
        // eslint-disable-next-line array-callback-return
        const filteredPosts = posts.filter((item) => {
            if (item.id !== postID) {
                return item;
            }
        });
        setPosts(filteredPosts);
    }

    const updatePostState = (post: IPost) => {
        const updatedPosts = posts.map((item) => {
            if (item.id === post.id) {
                return {
                    ...item,
                    ...post
                }
            }

            return item;
        });
        setPosts(updatedPosts);
    }

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const fetchedPosts = await getPosts(username, { offset });

            if (isMountedRef.current) {
                setPosts([...posts, ...fetchedPosts]);
                setIsLoading(false);

                if (fetchedPosts.length !== 0) {
                    setOffset(offset + 1);
                }
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
        <div className="w-full">
            {(isLoading && posts.length === 0) && (
                <div className="flex min-h-10rem items-center justify-center">
                    <Loader />
                </div>
            )}
            {!isLoading && posts.length === 0 && error && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{error}</h6>
                </div>
            )}
            {(posts.length !== 0 && error !== null) && (
                <div>
                    {posts.map(post => (
                        <PostItem
                            key={post.id}
                            likeCallback={likeCallback}
                            post={post}
                            updateSuccessCallback={updateSuccessCallback}
                            deleteSuccessCallback={deleteSuccessCallback}
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
