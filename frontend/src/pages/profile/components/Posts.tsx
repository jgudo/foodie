import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { toast } from "react-toastify";
import CreatePostModal from "~/components/main/Modals/CreatePostModal";
import PostItem from '~/components/main/PostItem';
import Loader from "~/components/shared/Loader";
import useModal from "~/hooks/useModal";
import { createPost, getPosts } from "~/services/api";
import { IPost, IUser } from "~/types/types";

interface IProps {
    username: string;
    isOwnProfile: boolean;
    auth: IUser;
}

const Posts: React.FC<IProps> = (props) => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const [error, setError] = useState('');
    const { isOpen, openModal, closeModal } = useModal();

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
            const fetchedPosts = await getPosts(props.username, { offset });

            if (isMountedRef.current) {
                setPosts([...posts, ...fetchedPosts]);
                setIsLoading(false);

                if (fetchedPosts.length !== 0) {
                    setOffset(offset + 1);
                }
            }
        } catch (e) {
            if (isMountedRef.current) {
                if (posts.length === 0) {
                    setError(`${props.username} hasn't posted anything yet.`);
                } else {
                    setError(e.error.message || 'Something went wrong while trying to fetch posts.');
                }

                setIsLoading(false);
            }
        }
    };

    const dispatchCreatePost = async (form: FormData) => {
        try {
            setIsCreatingPost(true);
            const post = await createPost(form);

            setPosts([post, ...posts]);
            setIsCreatingPost(false);
            toast.dark('Post created successfully.');
        } catch (e) {
            setIsCreatingPost(false);
            toast.dismiss();
            toast.error('Somehing went wrong. Please try again later.');
        }
    }

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && posts.length !== 0,
        onLoadMore: fetchPosts,
        scrollContainer: 'window',
        threshold: 200
    });

    return (
        <div className="w-full">
            {props.isOwnProfile && (
                <div className="flex items-center justify-start mb-4">
                    <div
                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                        style={{ background: `#f8f8f8 url(${props.auth.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    />
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Create a post."
                            onClick={() => !isCreatingPost && openModal()}
                            readOnly={isCreatingPost}
                        />
                    </div>
                </div>
            )}
            {/* --- CREATE POST MODAL ----- */}
            <CreatePostModal
                isOpen={isOpen}
                openModal={openModal}
                closeModal={closeModal}
                dispatchCreatePost={dispatchCreatePost}
            />
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
                <div ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                    {posts.map(post => (
                        <PostItem
                            key={post.id}
                            likeCallback={likeCallback}
                            post={post}
                            updateSuccessCallback={updateSuccessCallback}
                            deleteSuccessCallback={deleteSuccessCallback}
                        />
                    ))}
                    {(posts.length !== 0 && !error && isLoading) && (
                        <div className="flex justify-center py-6">
                            <Loader />
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
