import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import UserCard from '~/components/main/UserCard';
import { getFollowing } from "~/services/api";
import { IProfile } from "~/types/types";

interface IFollowingState {
    user: IProfile;
    isFollowing: boolean;
}

const Following: React.FC<RouteComponentProps<{ username: string }>> = ({ match }) => {
    const [followings, setFollowing] = useState<IFollowingState[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const { username } = match.params;

    useEffect(() => {
        fetchFollowing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFollowing = async () => {
        try {
            setIsLoading(true);
            const fetchedFollowing = await getFollowing(username, { offset });

            setFollowing([...followings, ...fetchedFollowing]);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="w-2/4">
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
