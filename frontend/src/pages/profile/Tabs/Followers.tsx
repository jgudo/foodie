import React, { useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { UserCard } from "~/components/main";
import { Loader, UserLoader } from "~/components/shared";
import { useDidMount, useDocumentTitle } from "~/hooks";
import { getFollowers } from "~/services/api";
import { IError, IProfile } from "~/types/types";

interface IProps {
    username: string;
}

const Followers: React.FC<IProps> = ({ username }) => {
    const [followers, setFollowers] = useState<IProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const didMount = useDidMount(true);
    const [error, setError] = useState<IError | null>(null);

    useDocumentTitle(`Followers - ${username} | Foodie`);
    useEffect(() => {
        fetchFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFollowers = async () => {
        try {
            setIsLoading(true);
            const fetchedFollowers = await getFollowers(username, { offset });

            if (didMount) {
                setFollowers([...followers, ...fetchedFollowers]);
                setIsLoading(false);
                setOffset(offset + 1);

                setError(null);
            }
        } catch (e) {
            if (didMount) {
                setIsLoading(false);
                setError(e)
            }
            console.log(e);
        }
    };

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && followers.length >= 10,
        onLoadMore: fetchFollowers,
        scrollContainer: 'window',
        threshold: 200
    });

    return (
        <div className="w-full" ref={infiniteRef as React.RefObject<HTMLDivElement>}>
            {(isLoading && followers.length === 0) && (
                <div className="min-h-10rem px-4">
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                </div>
            )}
            {(!isLoading && followers.length === 0 && error) && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{error?.error?.message || 'Something went wrong.'}</h6>
                </div>
            )}
            {followers.length !== 0 && (
                <div>
                    <h4 className="text-gray-700 dark:text-white mb-4 ml-4 mt-4 laptop:mt-0">Followers</h4>
                    <TransitionGroup component={null}>
                        {followers.map(user => (
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
                    {(followers.length !== 0 && !error && isLoading) && (
                        <div className="flex justify-center py-6">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Followers;
