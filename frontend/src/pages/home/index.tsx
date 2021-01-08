import { TeamOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreatePost from "~/components/main/CreatePost";
import PostItem from "~/components/main/PostItem";
import { setNewsFeedErrorMessage } from "~/redux/action/errorActions";
import { clearNewsFeed, deleteFeedPost, getNewsFeedStart, updateFeedPost } from "~/redux/action/feedActions";
import { IPost, IRootReducer } from "~/types/types";

const Home: React.FC = () => {
    const { newsFeed, auth, error, isLoading } = useSelector((state: IRootReducer) => ({
        newsFeed: state.newsFeed,
        auth: state.auth,
        error: state.error.newsFeedError,
        isLoading: state.loading.isLoadingFeed
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        if (newsFeed.items.length === 0) {
            fetchNewsFeed();
        }

        return () => {
            dispatch(clearNewsFeed());
            dispatch(setNewsFeedErrorMessage(''));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNewsFeed = () => {
        if (!isLoading) {
            dispatch(getNewsFeedStart({ offset: newsFeed.offset }));
        }
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

    return (
        <div className="contain pt-20 flex items-start">
            <div className="w-1/4 rounded-md bg-white py-4 sticky top-20 mr-4 shadow-sm divide-y-2">
                <ul>
                    <li className="py-2 cursor-pointer px-4 rounded-md hover:bg-indigo-100">
                        <Link to={`/${auth.username}`} className="flex items-center text-black">
                            <div
                                className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-4"
                                style={{ background: `#f8f8f8 url(${auth.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                            />
                            <h6>My Profile</h6>
                        </Link>
                    </li>
                    <li className="py-2 cursor-pointer px-4 mt-4 rounded-md hover:bg-indigo-100">
                        <Link to={`/${auth.username}/friends`} className="flex items-center text-black">
                            <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                            <h6>Friends</h6>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="w-2/4">
                <CreatePost />
                {newsFeed.items.map((post: IPost) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        likeCallback={likeCallback}
                        updateSuccessCallback={updateSuccessCallback}
                        deleteSuccessCallback={deleteSuccessCallback}
                    />
                ))}
                {newsFeed.items.length !== 0 && !error && (
                    <div className="flex justify-center py-6">
                        <button onClick={fetchNewsFeed} disabled={isLoading}>Load More</button>
                    </div>
                )}
                {(newsFeed.items.length !== 0 && error) && (
                    <div className="flex justify-center py-6">
                        <p className="text-gray-400 italic">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
