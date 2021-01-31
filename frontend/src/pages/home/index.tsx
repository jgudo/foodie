import { CoffeeOutlined, UndoOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import withAuth from "~/components/hoc/withAuth";
import CreatePostModal from "~/components/main/Modals/CreatePostModal";
import PostItem from "~/components/main/PostItem";
import SuggestedPeople from "~/components/main/SuggestedPeople";
import Avatar from "~/components/shared/Avatar";
import Loader from "~/components/shared/Loader";
import { PostLoader } from "~/components/shared/Loaders";
import useDocumentTitle from "~/hooks/useDocumentTitle";
import useModal from "~/hooks/useModal";
import { clearNewsFeed, createPostStart, deleteFeedPost, getNewsFeedStart, hasNewFeed, updateFeedPost } from "~/redux/action/feedActions";
import socket from "~/socket/socket";
import { IPost, IRootReducer } from "~/types/types";
import SideMenu from "./SideMenu";

interface ILocation {
    from: string;
}

interface IProps extends RouteComponentProps<any, any, ILocation> {
    isAuth: boolean;
}

const Home: React.FC<IProps> = (props) => {
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


    useDocumentTitle('Foodie | Social Network');
    useEffect(() => {
        console.log('TRIGGER', from)
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
        hasNextPage: !state.error && state.newsFeed.items.length >= 10,
        onLoadMore: fetchNewsFeed,
        scrollContainer: 'window',
    });

    return (
        <div className="laptop:px-6% pt-20 flex items-start">
            {/*  --- SIDE MENU --- */}
            <div className="hidden laptop:block laptop:w-1/4 laptop:rounded-md bg-white laptop:sticky laptop:top-20 mr-4 laptop:shadow-lg divide-y-2">
                {props.isAuth && (
                    <SideMenu username={state.auth.username} profilePicture={state.auth.profilePicture} />
                )}
            </div>
            <div className="w-full laptop:w-2/4 relative">
                {/* --- CREATE POST INPUT ---- */}
                {props.isAuth && (
                    <div className="flex items-center justify-start mb-4 px-4 laptop:px-0">
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
                )}
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
                {props.isAuth && (
                    <CreatePostModal
                        isOpen={isOpen}
                        openModal={openModal}
                        closeModal={closeModal}
                        dispatchCreatePost={dispatchCreatePost}
                    />
                )}
                {(state.error && state.newsFeed.items.length === 0) && (
                    <div className="flex flex-col w-full min-h-24rem items-center justify-center">
                        <CoffeeOutlined className="text-8xl text-gray-300 mb-4" />
                        <h5 className="text-gray-500">News feed is empty</h5>
                        <p className="text-gray-400">Start following people or create your first post.</p>
                    </div>
                )}
                {/* ---- LOADING INDICATOR ----- */}
                {(state.isLoadingFeed && state.newsFeed.items.length === 0) && (
                    <div className="mt-4 px-2 overflow-hidden space-y-6 pb-10">
                        <PostLoader />
                        <PostLoader />
                    </div>
                )}
                {state.isLoadingCreatePost && (
                    <div className="mt-4 px-2 overflow-hidden pb-10">
                        <PostLoader />
                    </div>
                )}
                {(!props.isAuth && !state.isLoadingFeed && !state.error) && (
                    <div className="px-4 laptop:px-0 py-4 mb-4">
                        <h2>Public posts that might <br />interest you.</h2>
                    </div>
                )}
                {/* ---- NEWS FEED ---- */}
                {(state.newsFeed.items.length !== 0) && (
                    <>
                        <TransitionGroup component={null}>
                            <div ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                                {state.newsFeed.items.map((post: IPost) => post.author && ( // avoid render posts with null author
                                    <CSSTransition
                                        timeout={500}
                                        classNames="fade"
                                        key={post.id}
                                    >
                                        <PostItem
                                            key={post.id}
                                            post={post}
                                            likeCallback={likeCallback}
                                            updateSuccessCallback={updateSuccessCallback}
                                            deleteSuccessCallback={deleteSuccessCallback}
                                        />
                                    </CSSTransition>
                                ))}
                            </div>
                        </TransitionGroup>
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
            <div className="hidden laptop:block laptop:w-1/4 laptop:sticky laptop:top-20 ml-4">
                {props.isAuth && (
                    <SuggestedPeople />
                )}
            </div>
        </div >
    );
};

export default withAuth(Home);
