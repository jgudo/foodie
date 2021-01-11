import { useEffect, useRef, useState } from "react";
import UserCard from '~/components/main/UserCard';
import Loader from "~/components/shared/Loader";
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
            }
        } catch (e) {
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
            {!isLoading && followings.length === 0 ? (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{username} is not following anyone.</h6>
                </div>
            ) : followings.map(following => (
                <UserCard
                    key={following.user._id}
                    profile={following.user}
                    isFollowing={following.isFollowing}
                />
            ))}
        </div>
    );
};

export default Following;
