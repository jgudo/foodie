import { IProfile, IUser } from "~/types/types";

interface IProps {
    profile: IProfile,
    isLoadingGetUser: boolean;
    auth: IUser;
}

const Header: React.FC<IProps> = ({ profile, auth, isLoadingGetUser }) => {
    return (
        <div>
            <div className="w-full h-80 bg-gray-200 relative">
                <img
                    alt=""
                    className="w-full h-full object-cover"
                    src={profile.coverPhoto || `https://source.unsplash.com/1400x900/?nature`}
                />
            </div>
            <div className="w-full relative px-20 flex transform -translate-y-28">
                {/* --- PROFILE PICTURE */}
                <div className="relative w-1/3 h-60 overflow-hidden mr-2 flex justify-center">
                    <img
                        alt=""
                        className="w-60 h-60 object-cover rounded-full border-4 border-white bg-gray-400"
                        src={profile.profilePicture || `https://i.pravatar.cc/500?${new Date().getTime()}`}
                    />
                </div>
                <div className="flex w-full  flex-col self-end">
                    <div className="w-full flex justify-between mr-14 ml-2">
                        {/* ---- NAME AND USERNAME */}
                        <div>
                            <h2 className="text-3xl">{profile.fullname || `@${profile.username}`}</h2>
                            <span className="text-indigo-700">{profile.fullname && `@${profile.username}`}</span>
                        </div>
                        {/* ---- FOLLOW/UNFOLLOW BUTTON */}
                        {profile.username !== auth.username && (
                            <div>
                                <button className={`text-xl ${profile.isFollowing && '!bg-indigo-100 !border !border-indigo-500 !text-indigo-700'}`}>
                                    {profile.isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        )}
                    </div>
                    {/* ---- PROFILE NAVS ----- */}
                    <ul className="flex items-center space-x-4">
                        <li className="text-lg font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-md cursor-pointer px-4 py-2">
                            Info
                        </li>
                        <li className="text-lg font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-md cursor-pointer px-4 py-2">
                            <span className="text-lg text-indigo-700">{profile.followersCount}</span>
                            &nbsp;&nbsp;
                            <span>Followers</span>
                        </li>
                        <li className="text-lg font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-md cursor-pointer px-4 py-2">
                            <span className="text-lg text-indigo-700">{profile.followingCount}</span>
                            &nbsp;&nbsp;
                            <span>Following</span>
                        </li>
                        <li className="text-lg font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-md cursor-pointer px-4 py-2">
                            Bookmarks
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
