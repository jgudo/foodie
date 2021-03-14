import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FollowButton } from "~/components/main";
import { Avatar, UserLoader } from "~/components/shared";
import { SUGGESTED_PEOPLE } from "~/constants/routes";
import { getSuggestedPeople } from "~/services/api";
import { IError, IProfile } from "~/types/types";

const SuggestedPeople: React.FC = () => {
    const [people, setPeople] = useState<IProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IError | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const users = await getSuggestedPeople({ offset: 0, limit: 6 });

                setPeople(users);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                setError(e);
            }
        })();
    }, []);

    return (
        <div className="w-full py-4 bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden">
            <div className="px-4 flex justify-between mb-4">
                <h4 className="dark:text-white">Suggested People</h4>
                <Link to={SUGGESTED_PEOPLE} className="text-xs underline dark:text-indigo-500">See all</Link>
            </div>
            {isLoading && (
                <div className="min-h-10rem px-4">
                    <UserLoader />
                    <UserLoader />
                    <UserLoader />
                    <UserLoader />
                </div>
            )}
            {(!isLoading && error) && (
                <div className="flex min-h-10rem items-center justify-center">
                    <span className="text-gray-400 italic">
                        {(error as IError)?.error?.message || 'Something went wrong :('}
                    </span>
                </div>
            )}
            {!error && people.map((user) => (
                <div className="mb-2" key={user.id || user._id}>
                    <div className="relative flex items-center justify-between px-4 py-2">
                        <Link to={`/user/${user.username}`}>
                            <div className="flex items-center">
                                <Avatar url={user.profilePicture?.url} className="mr-2" />
                                <h6 className="mr-10 text-sm overflow-ellipsis overflow-hidden dark:text-white">{user.username}</h6>
                            </div>
                        </Link>
                        <div className="absolute px-4 bg-white dark:bg-indigo-1000 right-0 top-0 bottom-0 my-auto flex items-center">
                            <FollowButton
                                userID={user.id || user._id}
                                isFollowing={user.isFollowing}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestedPeople;
