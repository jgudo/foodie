import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PostItem } from '~/components/main';
import { Loader } from '~/components/shared';
import { useDocumentTitle } from '~/hooks';
import { PageNotFound } from '~/pages';
import { getSinglePost } from '~/services/api';
import { IError, IPost } from '~/types/types';

const Post: React.FC<RouteComponentProps<{ post_id: string; }>> = ({ history, match }) => {
    const [post, setPost] = useState<IPost | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IError | null>(null);
    const { post_id } = match.params;

    useDocumentTitle(`${post?.description} - Foodie` || 'View Post');
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
            setError(e);
        }
    };

    return (
        <>
            {(isLoading && !error) && (
                <div className="flex min-h-screen items-center justify-center">
                    <Loader />
                </div>
            )}
            {(!isLoading && !error && post) && (
                <div className="pt-20 w-full px-4 laptop:w-2/4 m-auto">
                    <PostItem
                        post={post}
                        likeCallback={likeCallback}
                        updateSuccessCallback={updateSuccessCallback}
                        deleteSuccessCallback={deleteSuccessCallback}
                    />
                </div>
            )}
            {(!isLoading && error) && (
                <>
                    {error.status_code === 404 ? (
                        <PageNotFound />
                    ) : (
                        <div className="flex items-center justify-center min-h-screen">
                            <h4 className="text-xl italic dark:text-white">
                                {error?.error?.message || 'Something went wrong :('}
                            </h4>
                        </div>
                    )}
                </>
            )}
        </>
    )
};

export default Post;
