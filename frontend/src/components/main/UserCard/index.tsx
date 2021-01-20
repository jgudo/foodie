import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "~/components/shared/Avatar";
import { IRootReducer, IUser } from "~/types/types";
import FollowButton from '../FollowButton';

interface IProps {
    profile: IUser;
    isFollowing: boolean;
}

const UserCard: React.FC<IProps> = ({ profile, isFollowing }) => {
    const myUsername = useSelector((state: IRootReducer) => state.auth.username);

    return (
        <div className="flex items-center justify-between px-4 py-2">
            <Link to={`/user/${profile.username}`}>
                <div className="flex items-center">
                    <Avatar url={profile.profilePicture} size="lg" className="mr-2" />
                    <h6 className="mr-10 max-w-md overflow-ellipsis overflow-hidden">@{profile.username}</h6>
                </div>
            </Link>
            {profile.username === myUsername ? (
                <h4 className="text-gray-400">Me</h4>
            ) : (
                    <FollowButton userID={profile.id} isFollowing={isFollowing} />
                )}
        </div>
    );
};

export default UserCard;
