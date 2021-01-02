import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostItem from "~/components/main/PostItem";
import { getNewsFeedStart } from "~/redux/action/feedActions";
import { IRootReducer } from "~/types/types";

const Home: React.FC = () => {
    const { newsFeed } = useSelector((state: IRootReducer) => ({
        newsFeed: state.newsFeed
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getNewsFeedStart({}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container pt-16">
            <div className="w-2/4">
                {newsFeed.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Home;
