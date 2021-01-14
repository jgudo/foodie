import { CoffeeOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import CreatePostModal from "~/components/main/Modals/CreatePostModal";
import PostItem from "~/components/main/PostItem";
import SuggestedPeople from "~/components/main/SuggestedPeople";
import Loader from "~/components/shared/Loader";
import useModal from "~/hooks/useModal";
import { clearNewsFeed, createPostStart, deleteFeedPost, getNewsFeedStart, updateFeedPost } from "~/redux/action/feedActions";
import { IPost, IRootReducer } from "~/types/types";

interface ILocation {
    from: string;
}

const Home: React.FC<RouteComponentProps<any, any, ILocation>> = (props) => {
    const state = useSelector((state: IRootReducer) => ({
        newsFeed: state.newsFeed,
        auth: state.auth,
        error: state.error.newsFeedError,
        isLoadingFeed: state.loading.isLoadingFeed,
        isLoadingCreatePost: state.loading.isLoadingCreatePost
    }));
    const dispatch = useDispatch();
    const { isOpen, openModal, closeModal } = useModal();
    const from = props.location.state?.from || null;

    useEffect(() => {
        if (state.newsFeed.items.length === 0 || from === '/') {
            dispatch(clearNewsFeed());
            dispatch(getNewsFeedStart({ offset: 0 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNewsFeed = () => {
        dispatch(getNewsFeedStart({ offset: state.newsFeed.offset }));
    };

    const likeCallback = (post: IPost) => {
        dispatch(updateFeedPost(post));
    }

    const updateSuccessCallback = (post: IPost) => {
        dispatch(updateFeedPost(post));
    }

    const deleteSuccessCallback = (postID: string) => {
        dispatch(deleteFeedPost(postID));
    }

    const dispatchCreatePost = (form: FormData) => {
        dispatch(createPostStart(form));
    }

    const infiniteRef = useInfiniteScroll({
        loading: state.isLoadingFeed,
        hasNextPage: !state.error && state.newsFeed.items.length !== 0,
        onLoadMore: fetchNewsFeed,
        scrollContainer: 'window',
        threshold: 200
    });

    return (
        <div className="contain pt-20 flex items-start">
            <div className="w-1/4 rounded-md bg-white sticky top-20 mr-4 shadow-sm divide-y-2">
                <ul>
                    <li className="px-4 py-3 cursor-pointer rounded-md hover:bg-indigo-100">
                        <Link to={`/user/${state.auth.username}`} className="flex items-center text-black">
                            <div
                                className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-4"
                                style={{ background: `#f8f8f8 url(${state.auth.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                            />
                            <h6 className="text-sm">My Profile</h6>
                        </Link>
                    </li>
                    <li className="px-4 py-3 cursor-pointer mt-4 rounded-md hover:bg-indigo-100">
                        <Link to={`/user/${state.auth.username}/following`} className="flex items-center text-black">
                            <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                            <h6 className="text-sm">Following</h6>
                        </Link>
                    </li>
                    <li className="px-4 py-3 cursor-pointer mt-4 rounded-md hover:bg-indigo-100">
                        <Link to={`/user/${state.auth.username}/followers`} className="flex items-center text-black">
                            <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                            <h6 className="text-sm">Followers</h6>
                        </Link>
                    </li>
                    <li className="px-4 py-3 cursor-pointer mt-4 rounded-md hover:bg-indigo-100">
                        <Link to={`/user/${state.auth.username}/bookmarks`} className="flex items-center text-black">
                            <StarOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                            <h6 className="text-sm">Bookmarks</h6>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="w-2/4" ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                {/* --- CREATE POST INPUT ---- */}
                <div className="flex items-center justify-start">
                    <div
                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                        style={{ background: `#f8f8f8 url(${state.auth.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    />
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Create a post."
                            onClick={() => !state.isLoadingCreatePost && openModal()}
                            readOnly={state.isLoadingFeed || state.isLoadingCreatePost}
                        />
                    </div>
                </div>
                {/* --- CREATE POST MODAL ----- */}
                <CreatePostModal
                    isOpen={isOpen}
                    openModal={openModal}
                    closeModal={closeModal}
                    dispatchCreatePost={dispatchCreatePost}
                />
                {(!state.isLoadingFeed && state.error && state.newsFeed.items.length === 0) && (
                    <div className="flex flex-col w-full min-h-screen items-center justify-center">
                        <CoffeeOutlined className="text-8xl text-gray-300 mb-4" />
                        <h5 className="text-gray-500">News feed is empty</h5>
                        <p className="text-gray-400">Start following people or create your first post.</p>
                    </div>
                )}
                {/* ---- LOADING INDICATOR ----- */}
                {(state.isLoadingFeed && !state.error) && (
                    <div className="flex w-full min-h-10rem items-center justify-center">
                        <Loader />
                    </div>
                )}
                {/* ---- NEWS FEED ---- */}
                {(state.newsFeed.items.length !== 0) && (
                    <>
                        {state.newsFeed.items.map((post: IPost) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                likeCallback={likeCallback}
                                updateSuccessCallback={updateSuccessCallback}
                                deleteSuccessCallback={deleteSuccessCallback}
                            />
                        ))}
                        {(state.newsFeed.items.length !== 0 && !state.error && state.isLoadingFeed) && (
                            <div className="flex justify-center py-6">
                                <Loader />
                            </div>
                        )}
                        {(state.newsFeed.items.length !== 0 && state.error) && (
                            <div className="flex justify-center py-6">
                                <p className="text-gray-400 italic">{state.error}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="w-1/4 sticky top-20 ml-4">
                <SuggestedPeople />
            </div>
        </div>
    );
};

export default Home;
