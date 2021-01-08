import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import UserCard from "~/components/main/UserCard";
import { getFollowers } from "~/services/api";
import { IProfile } from "~/types/types";

interface IFollowerState {
    user: IProfile;
    isFollowing: boolean;
}

const Followers: React.FC<RouteComponentProps<{ username: string; }>> = ({ match }) => {
    const [followers, setFollowers] = useState<IFollowerState[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0); // Pagination
    const { username } = match.params;

    useEffect(() => {
        fetchFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFollowers = async () => {
        try {
            setIsLoading(true);
            const fetchedFollowers = await getFollowers(username, { offset });

            setFollowers([...followers, ...fetchedFollowers]);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="w-full">
            {!isLoading && followers.length === 0 ? (
                <div className="w-full min-h-10rem flex items-center justify-center">
                    <h6 className="text-gray-400 italic">{username} has no followers.</h6>
                </div>
            ) : followers.map(follower => (
                <UserCard
                    key={follower.user._id}
                    profile={follower.user}
                    isFollowing={follower.isFollowing}
                />
            ))}
        </div>
    );
};

export default Followers;
