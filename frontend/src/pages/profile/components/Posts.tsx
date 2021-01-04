import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import PostItem from '~/components/main/PostItem';
import { getPosts } from "~/services/api";
import { IPost } from "~/types/types";

const Posts: React.FC<RouteComponentProps<{ username: string; }>> = ({ match }) => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
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
            setIsLoading(true);
        } catch (e) {
            console.log(e);
        }

    };

    return (
        <div className="w-2/4">
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    );
};

export default Posts;
