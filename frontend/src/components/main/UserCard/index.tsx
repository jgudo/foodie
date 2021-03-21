import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FollowButton } from '~/components/main';
import { Avatar } from "~/components/shared";
import { IProfile, IRootReducer, IUser } from "~/types/types";

interface IProps {
    profile: IProfile | IUser;
}

const UserCard: React.FC<IProps> = ({ profile }) => {
    const myUsername = useSelector((state: IRootReducer) => state.auth.username);

    return (
        <div className="relative flex items-center justify-between px-4 py-2">
            <Link to={`/user/${profile.username}`}>
                <div className="flex items-center">
                    <Avatar url={profile.profilePicture?.url} size="lg" className="mr-2" />
                    <h6 className="mr-10 max-w-md overflow-ellipsis overflow-hidden dark:text-indigo-400">@{profile.username}</h6>
                </div>
            </Link>
            <div className="absolute px-4 bg-white dark:bg-transparent right-0 top-0 bottom-0 my-auto flex items-center">
                {profile.username === myUsername ? (
                    <h4 className="text-gray-400">Me</h4>
                ) : (
                    <FollowButton userID={profile.id} isFollowing={profile.isFollowing} />
                )}
            </div>
        </div>
    );
};

export default UserCard;
