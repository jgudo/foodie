import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import UserCard from '~/components/main/UserCard';
import Loader from "~/components/shared/Loader";
import { UserLoader } from "~/components/shared/Loaders";
import { getFollowing } from "~/services/api";
import { IError, IProfile } from "~/types/types";

interface IProps {
    username: string;
}

interface IFollowingState {
    user: IProfile;
    isFollowing: boolean;
}

const Following: React.FC<IProps> = ({ username }) => {
    const [followings, setFollowing] = useState<IFollowingState[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const [error, setError] = useState<IError | null>(null);
    let isMountedRef = useRef<boolean | null>(null);

    useEffect(() => {
        fetchFollowing();

        if (isMountedRef) isMountedRef.current = true;

        return () => {
            if (isMountedRef) isMountedRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFollowing = async () => {
        try {
            setIsLoading(true);
            const fetchedFollowing = await getFollowing(username, { offset });

            if (isMountedRef.current) {
                setFollowing([...followings, ...fetchedFollowing]);
                setIsLoading(false);
                setOffset(offset + 1);
                setError(null);
            }
        } catch (e) {
            console.log(e);
            if (isMountedRef.current) {
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
            {isLoading && (
                <div className="min-h-10rem px-4">
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                </div>
            )}
            {!isLoading && followings.length === 0 && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">
                        {error?.error?.message || `${username} isn't following anyone.`}
                    </h6>
                </div>
            )}
            {followings.length !== 0 && (
                <div>
                    <TransitionGroup component={null}>
                        {followings.map(following => (
                            <CSSTransition
                                timeout={500}
                                classNames="fade"
                                key={following.user._id}
                            >
                                <div className="bg-white rounded-md mb-4 shadow-md" key={following.user._id}>
                                    <UserCard
                                        profile={following.user}
                                        isFollowing={following.isFollowing}
                                    />
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
