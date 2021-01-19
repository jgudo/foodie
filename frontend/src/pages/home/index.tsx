import { CoffeeOutlined, UndoOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import CreatePostModal from "~/components/main/Modals/CreatePostModal";
import PostItem from "~/components/main/PostItem";
import SuggestedPeople from "~/components/main/SuggestedPeople";
import Avatar from "~/components/shared/Avatar";
import Loader from "~/components/shared/Loader";
import useModal from "~/hooks/useModal";
import { clearNewsFeed, createPostStart, deleteFeedPost, getNewsFeedStart, hasNewFeed, updateFeedPost } from "~/redux/action/feedActions";
import socket from "~/socket/socket";
import { IPost, IRootReducer } from "~/types/types";
import SideMenu from "./SideMenu";

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

        socket.on('newFeed', () => {
            dispatch(hasNewFeed());
        });
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

    const onClickNewFeed = () => {
        dispatch(clearNewsFeed());
        dispatch(getNewsFeedStart({ offset: 0 }));
        dispatch(hasNewFeed(false));
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
            {/*  --- SIDE MENU --- */}
            <div className="w-1/4 rounded-md bg-white sticky top-20 mr-4 shadow-lg divide-y-2">
                <SideMenu username={state.auth.username} profilePicture={state.auth.profilePicture} />
            </div>
            <div className="w-2/4 relative" ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                {/* --- CREATE POST INPUT ---- */}
                <div className="flex items-center justify-start">
                    <Avatar url={state.auth.profilePicture} className="mr-2" />
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Create a post."
                            onClick={() => !state.isLoadingCreatePost && openModal()}
                            readOnly={state.isLoadingFeed || state.isLoadingCreatePost}
                        />
                    </div>
                </div>
                {/*  --- HAS NEW FEED NOTIF --- */}
                {state.newsFeed.hasNewFeed && (
                    <button
                        className="sticky mt-2 top-16 left-0 right-0 mx-auto z-20 flex items-center"
                        onClick={onClickNewFeed}
                    >
                        <UndoOutlined className="flex items-center justify-center text-xl mr-4" />
                        New Feed Available
                    </button>
                )}
                {/* --- CREATE POST MODAL ----- */}
                <CreatePostModal
                    isOpen={isOpen}
                    openModal={openModal}
                    closeModal={closeModal}
                    dispatchCreatePost={dispatchCreatePost}
                />
                {(state.error && state.newsFeed.items.length === 0) && (
                    <div className="flex flex-col w-full min-h-screen items-center justify-center">
                        <CoffeeOutlined className="text-8xl text-gray-300 mb-4" />
                        <h5 className="text-gray-500">News feed is empty</h5>
                        <p className="text-gray-400">Start following people or create your first post.</p>
                    </div>
                )}
                {/* ---- LOADING INDICATOR ----- */}
                {(state.isLoadingFeed) && (
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
                        {state.isLoadingFeed && (
                            <div className="flex justify-center py-6">
                                <Loader />
                            </div>
                        )}
                        {state.error && (
                            <div className="flex justify-center py-6">
                                <p className="text-gray-400 italic">{state.error.error.message}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* --- SUGGESTED PEOPLE --- */}
            <div className="w-1/4 sticky top-20 ml-4">
                <SuggestedPeople />
            </div>
        </div>
    );
};

export default Home;
