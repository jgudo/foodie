import { useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { toast } from "react-toastify";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CreatePostModal, PostItem, PostModals } from "~/components/main";
import { Avatar, Loader } from "~/components/shared";
import { PostLoader } from "~/components/shared/Loaders";
import { useDidMount, useDocumentTitle, useModal } from "~/hooks";
import { createPost, getPosts } from "~/services/api";
import { IError, IPost, IUser } from "~/types/types";

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
    const [error, setError] = useState<IError | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const didMount = useDidMount(true);

    useDocumentTitle(`Posts - ${props.username} | Foodie`);
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const likeCallback = (postID: string, state: boolean, newLikesCount: number) => {
        const updatedPosts = posts.map((item) => {
            if (item.id === postID) {
                return {
                    ...item,
                    isLiked: state,
                    likesCount: newLikesCount
                }
            }

            return item;
        });
        setPosts(updatedPosts)
    };

    const updateSuccessCallback = (post: IPost) => {
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

    const deleteSuccessCallback = (postID: string) => {
        // eslint-disable-next-line array-callback-return
        const filteredPosts = posts.filter((item) => {
            if (item.id !== postID) {
                return item;
            }
        });
        setPosts(filteredPosts);
    }

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const fetchedPosts = await getPosts(props.username, { offset });

            if (didMount) {
                setPosts([...posts, ...fetchedPosts]);
                setIsLoading(false);

                if (fetchedPosts.length !== 0) {
                    setOffset(offset + 1);
                }
            }
        } catch (e) {
            if (didMount) {
                setError(e);
                setIsLoading(false);
            }
        }
    };

    const dispatchCreatePost = async (form: FormData) => {
        try {
            setIsCreatingPost(true);
            const post = await createPost(form);

            if (didMount) {
                setPosts([post, ...posts]);
                setIsCreatingPost(false);
                setError(null);
            }

            toast.dismiss();
            toast.dark('Post created successfully.');
        } catch (e) {
            if (didMount) {
                setIsCreatingPost(false);
            }

            toast.dismiss();
            toast.error('Somehing went wrong. Please try again later.');
        }
    }

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && posts.length >= 10,
        onLoadMore: fetchPosts,
        scrollContainer: 'window',
        threshold: 200
    });

    return (
        <div className="w-full">
            {props.isOwnProfile && (
                <div className="flex items-center justify-start mb-4 px-4 mt-4 laptop:mt-0 laptop:px-0">
                    <Avatar url={props.auth.profilePicture?.url} className="mr-2" />
                    <div className="flex-grow">
                        <input
                            className="dark:bg-indigo-1100 dark:text-white dark:border-gray-800"
                            type="text"
                            placeholder="Create a post."
                            onClick={() => !isCreatingPost && openModal()}
                            readOnly={isCreatingPost}
                        />
                    </div>
                </div>
            )}
            {/* --- CREATE POST MODAL ----- */}
            {isOpen && (
                <CreatePostModal
                    isOpen={isOpen}
                    openModal={openModal}
                    closeModal={closeModal}
                    dispatchCreatePost={dispatchCreatePost}
                />
            )}
            {(isLoading || isCreatingPost) && (
                <div className="mt-4 px-2 overflow-hidden space-y-6 pb-10">
                    <PostLoader />
                </div>
            )}
            {!isLoading && posts.length === 0 && error && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">
                        {error?.error?.message || 'Something went wrong :('}
                    </h6>
                </div>
            )}
            {(posts.length !== 0) && (
                <div ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                    <TransitionGroup component={null}>
                        {posts.map(post => (
                            <CSSTransition
                                timeout={500}
                                classNames="fade"
                                key={post.id}
                            >
                                <PostItem
                                    key={post.id}
                                    likeCallback={likeCallback}
                                    post={post}
                                />
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                    {(posts.length !== 0 && !error && isLoading) && (
                        <div className="flex justify-center py-6">
                            <Loader />
                        </div>
                    )}
                    {(posts.length !== 0 && error) && (
                        <div className="flex justify-center py-6">
                            <p className="text-gray-400 italic">
                                {(error as IError)?.error?.message || 'No more posts.'}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {/* ----- POST MODALS ---- */}
            <PostModals
                deleteSuccessCallback={deleteSuccessCallback}
                updateSuccessCallback={updateSuccessCallback}
            />
        </div>
    );
};

export default Posts;
