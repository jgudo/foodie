import React, { useEffect, useRef, useState } from "react";
import UserCard from "~/components/main/UserCard";
import Loader from "~/components/shared/Loader";
import { getFollowers } from "~/services/api";
import { IProfile } from "~/types/types";

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
    const [error, setError] = useState('');

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

                if (fetchFollowers.length === 0) {
                    setError(`${username} has no followers.`);
                } else {
                    setError('');
                }
            }
        } catch (e) {
            setIsLoading(false);
            setError(e.error.message)
            console.log(e);
        }
    };

    return (
        <div className="w-full">
            {isLoading && (
                <div className="flex min-h-10rem items-center justify-center">
                    <Loader />
                </div>
            )}
            {!isLoading && followers.length === 0 ? (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{error}</h6>
                </div>
            ) : followers.map(follower => (
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
