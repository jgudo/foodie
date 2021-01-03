import { IProfile } from "~/types/types";

interface IProps {
    profile: IProfile,
    isLoadingGetUser: boolean;
}

const Header: React.FC<IProps> = ({ profile, isLoadingGetUser }) => {
    return (
        <div>
            <div className="w-full h-80 bg-gray-200 relative">
                <img
                    alt=""
                    className="w-full h-full object-cover"
                    src={profile.coverPhoto || `https://source.unsplash.com/1400x900/?nature`}
                />
            </div>
            <div className="w-full relative px-14 flex">
                {/* --- PROFILE PICTURE */}
                <div className="relative w-60 h-60 overflow-hidden rounded-full border-4 border-white transform -translate-y-28">
                    <img
                        alt=""
                        className="w-full h-full object-cover"
                        src={profile.profilePicture || `https://i.pravatar.cc/500?${new Date().getTime()}`}
                    />
                </div>
                {/* ---- NAME AND USERNAME */}
                <div>
                    <h2 className="text-3xl">{profile.fullname || `@${profile.username}`}</h2>
                    <span>{profile.fullname && `@${profile.username}`}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
