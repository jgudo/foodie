import { EditOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import FollowButton from '~/components/main/FollowButton';
import { IProfile, IUser } from "~/types/types";
import Tabs from './Tabs';

interface IProps {
    profile: IProfile,
    isLoadingGetUser: boolean;
    auth: IUser;
}

const Header: React.FC<IProps> = ({ profile, auth, isLoadingGetUser }) => {
    const history = useHistory();

    return (
        <div>
            <div className="w-full h-80 bg-gray-200 relative">
                <img
                    alt=""
                    className="w-full h-full object-cover"
                    src={profile.coverPhoto || `https://source.unsplash.com/1400x900/?nature`}
                />
            </div>
            <div className="contain w-full relative flex transform -translate-y-28">
                {/* --- PROFILE PICTURE */}
                <div className="relative w-1/3 h-60 overflow-hidden mr-2 flex justify-center">
                    <img
                        alt=""
                        className="w-60 h-60 object-cover rounded-full border-4 border-white bg-gray-400"
                        src={profile.profilePicture || `https://i.pravatar.cc/500?${new Date().getTime()}`}
                    />
                </div>
                <div className="flex w-full  flex-col self-end">
                    <div className="w-full flex justify-between mr-14 ml-2 mb-2">
                        {/* ---- NAME AND USERNAME */}
                        <div>
                            <h2 className="text-3xl">{profile.fullname || `@${profile.username}`}</h2>
                            <span className="text-indigo-700">{profile.fullname && `@${profile.username}`}</span>
                        </div>
                        {/* ---- FOLLOW/UNFOLLOW BUTTON */}
                        {profile.username !== auth.username ? (
                            <FollowButton isFollowing={profile.isFollowing} userID={profile.id} />
                        ) : (
                                <button
                                    className="button--muted !rounded-full !border !border-gray-400 !focus:bg-gray-200 !py-0 flex items-center justify-center"
                                    onClick={() => history.push(`/${profile.username}/edit`)}
                                >
                                    <EditOutlined className="text-xl mr-4" />
                                    Edit Profile
                                </button>
                            )}
                    </div>
                    {/* ---- PROFILE NAVS ----- */}
                    <Tabs
                        username={profile.username}
                        isOwnProfile={profile.id === auth.id}
                        followersCount={profile.followersCount}
                        followingCount={profile.followingCount}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
