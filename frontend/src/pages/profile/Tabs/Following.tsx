import { useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { UserCard } from '~/components/main';
import { Loader, UserLoader } from "~/components/shared";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { getFollowing } from "~/services/api";
import { IError, IProfile } from "~/types/types";

interface IProps {
    username: string;
}

const Following: React.FC<IProps> = ({ username }) => {
    const [followings, setFollowing] = useState<IProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const [error, setError] = useState<IError | null>(null);
    const didMount = useDidMount(true);

    useDocumentTitle(`Following - ${username} | Foodie`);
    useEffect(() => {
        fetchFollowing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFollowing = async () => {
        try {
            setIsLoading(true);
            const fetchedFollowing = await getFollowing(username, { offset });

            if (didMount) {
                setFollowing([...followings, ...fetchedFollowing]);
                setIsLoading(false);
                setOffset(offset + 1);
                setError(null);
            }
        } catch (e) {
            console.log(e);
            if (didMount) {
                setIsLoading(false);
                setError(e);
            }
        }
    };

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && followings.length >= 10,
        onLoadMore: fetchFollowing,
        scrollContainer: 'window',
        threshold: 200
    });

    return (
        <div className="w-full" ref={infiniteRef as React.RefObject<HTMLDivElement>}>
            {(isLoading && followings.length === 0) && (
                <div className="min-h-10rem px-4">
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                </div>
            )}
            {(!isLoading && followings.length === 0 && error) && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">
                        {error?.error?.message || `${username} isn't following anyone.`}
                    </h6>
                </div>
            )}
            {followings.length !== 0 && (
                <div>
                    <h4 className="text-gray-700 dark:text-white mb-4 ml-4 mt-4 laptop:mt-0">Following</h4>
                    <TransitionGroup component={null}>
                        {followings.map(user => (
                            <CSSTransition
                                timeout={500}
                                classNames="fade"
                                key={user.id}
                            >
                                <div className="bg-white dark:bg-indigo-1000 rounded-md mb-4 shadow-md">
                                    <UserCard profile={user} />
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                    {(!error && isLoading) && (
                        <div className="flex justify-center py-6">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Following;
