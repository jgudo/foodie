import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "~/components/shared/Avatar";
import Loader from "~/components/shared/Loader";
import { getSuggestedPeople } from "~/services/api";
import { IProfile } from "~/types/types";
import FollowButton from "../FollowButton";

const SuggestedPeople: React.FC = () => {
    const [people, setPeople] = useState<IProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const users = await getSuggestedPeople({ offset: 0, limit: 6 });

                setPeople(users);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                setError(e.error.message);
            }
        })();
    }, []);

    return error ? null : (
        <div className="w-full py-4 bg-white rounded-md shadow-lg overflow-hidden">
            <div className="px-4 flex justify-between mb-4">
                <h4>Suggested People</h4>
                <Link to={`/people/suggested`} className="text-xs underline">See all</Link>
            </div>
            {isLoading && (
                <div className="flex min-h-10rem items-center justify-center">
                    <Loader />
                </div>
            )}
            {(!isLoading && error) && (
                <div className="flex min-h-10rem items-center justify-center">
                    <span className="text-gray-400 italic">{error}</span>
                </div>
            )}
            {people.map((user) => (
                <div className="mb-2" key={user._id}>
                    <div className="flex items-center justify-between px-4 py-2">
                        <Link to={`/user/${user.username}`}>
                            <div className="flex items-center">
                                <Avatar url={user.profilePicture} className="mr-2" />
                                <h6 className="mr-10 text-sm max-w-md overflow-ellipsis overflow-hidden">{user.username}</h6>
                            </div>
                        </Link>
                        <FollowButton
                            userID={user.id || user._id}
                            isFollowing={user.isFollowing}
                            size="sm"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestedPeople;
