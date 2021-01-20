import React, { useEffect, useRef, useState } from "react";
import UserCard from "~/components/main/UserCard";
import { UserLoader } from "~/components/shared/Loaders";
import { getFollowers } from "~/services/api";
import { IError, IProfile } from "~/types/types";

interface IProps {
    username: string;
}

interface IFollowerState {
    user: IProfile;
    isFollowing: boolean;
}

const Followers: React.FC<IProps> = ({ username }) => {
    const [followers, setFollowers] = useState<IFollowerState[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    let isMountedRef = useRef<boolean | null>(null);
    const [error, setError] = useState<IError | null>(null);

    useEffect(() => {
        fetchFollowers();

        if (isMountedRef) isMountedRef.current = true;

        return () => {
            if (isMountedRef) isMountedRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFollowers = async () => {
        try {
            setIsLoading(true);
            const fetchedFollowers = await getFollowers(username, { offset });

            if (isMountedRef.current) {
                setFollowers([...followers, ...fetchedFollowers]);
                setIsLoading(false);

                setError(null);
            }
        } catch (e) {
            setIsLoading(false);
            setError(e)
            console.log(e);
        }
    };

    return (
        <div className="w-full">
            {isLoading && (
                <div className="min-h-10rem px-4">
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                    <UserLoader includeButton={true} />
                </div>
            )}
            {!isLoading && followers.length === 0 && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{error?.error?.message || 'Something went wrong.'}</h6>
                </div>
            )}
            {(!isLoading && !error) && followers.map(follower => (
                <div className="bg-white rounded-md mb-4 shadow-md" key={follower.user._id}>
                    <UserCard
                        profile={follower.user}
                        isFollowing={follower.isFollowing}
                    />
                </div>
            ))}
        </div>
    );
};

export default Followers;
