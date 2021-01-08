import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PostItem from '~/components/main/PostItem';
import { getSinglePost } from '~/services/api';
import { IPost } from '~/types/types';

const Post: React.FC<RouteComponentProps<{ post_id: string; }>> = ({ history, match }) => {
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { post_id } = match.params;

    useEffect(() => {
        fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const likeCallback = (post: IPost) => {
        setPost(post);
    }

    const updateSuccessCallback = (post: IPost) => {
        setPost(post);
    }

    const deleteSuccessCallback = () => {
        history.push('/');
    }

    const fetchPost = async () => {
        try {
            setIsLoading(true);

            const fetchedPost = await getSinglePost(post_id);
            console.log(fetchedPost);
            setIsLoading(false);
            setPost(fetchedPost);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            setError(e.error.message || 'Unable to process request.')
        }
    };

    return (
        <>
            {(isLoading && !error) && (
                <div className="flex justify-center items-center min-h-screen">
                    <h4 className="text-xl">Loading...</h4>
                </div>
            )}
            {(!isLoading && !error && post) && (
                <div className="pt-20 w-2/4 m-auto">
                    <PostItem
                        post={post}
                        likeCallback={likeCallback}
                        updateSuccessCallback={updateSuccessCallback}
                        deleteSuccessCallback={deleteSuccessCallback}
                    />
                </div>
            )}
            {(!isLoading && error) && (
                <div className="flex items-center justify-center min-h-screen">
                    <h4 className="text-xl italic">{error}</h4>
                </div>
            )}
        </>
    )
};

export default Post;
