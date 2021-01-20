import { useEffect, useRef, useState } from "react";
import UserCard from '~/components/main/UserCard';
import { UserLoader } from "~/components/shared/Loaders";
import { getFollowing } from "~/services/api";
import { IProfile } from "~/types/types";

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
    const [error, setError] = useState('');
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

                if (fetchedFollowing.length === 0) {
                    setError(`${username} is not following anyone.`);
                } else {
                    setError('');
                }
            }
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            setError(e.error.message);
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
            {!isLoading && followings.length === 0 && (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{error}</h6>
                </div>
            )}
            {(!isLoading && !error) && followings.map(following => (
                <div className="bg-white rounded-md mb-4 shadow-md" key={following.user._id}>
                    <UserCard
                        profile={following.user}
                        isFollowing={following.isFollowing}
                    />
                </div>
            ))}
        </div>
    );
};

export default Following;
