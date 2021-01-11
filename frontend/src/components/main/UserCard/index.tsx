import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IProfile, IRootReducer } from "~/types/types";
import FollowButton from '../FollowButton';

interface IProps {
    profile: IProfile;
    isFollowing: boolean;
}

const UserCard: React.FC<IProps> = ({ profile, isFollowing }) => {
    const myUsername = useSelector((state: IRootReducer) => state.auth.username);

    return (
        <div className="flex items-center justify-between px-4 py-2">
            <Link to={`/user/${profile.username}`}>
                <div className="flex items-center">
                    <div
                        className="w-12 h-12 !bg-cover !bg-no-repeat rounded-full mr-2"
                        style={{ background: `#f8f8f8 url(${profile.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    />
                    <h6 className="mr-10 max-w-md overflow-ellipsis overflow-hidden">@{profile.username}</h6>
                </div>
            </Link>
            {profile.username === myUsername ? (
                <h4 className="text-gray-400">Me</h4>
            ) : (
                    <FollowButton userID={profile.id || profile._id} isFollowing={isFollowing} />
                )}
        </div>
    );
};

export default UserCard;
