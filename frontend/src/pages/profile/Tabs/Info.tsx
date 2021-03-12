import dayjs from 'dayjs';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useDocumentTitle } from '~/hooks';
import { IRootReducer } from "~/types/types";

const Info = () => {
    const { profile, isOwnProfile } = useSelector((state: IRootReducer) => ({
        profile: state.profile,
        isOwnProfile: state.auth.username === state.profile.username
    }));
    const history = useHistory();
    useDocumentTitle(`Info - ${profile.username} | Foodie`);

    return (
        <div className="p-4 bg-white dark:bg-indigo-1000 rounded-md min-h-10rem shadow-lg">
            <div className="flex justify-between">
                <h3 className="text-gray-500 dark:text-white">Info</h3>
                {isOwnProfile && (
                    <span
                        className="underline cursor-pointer text-indigo-700 dark:text-indigo-400 pr-4"
                        onClick={() => history.push(`/user/${profile.username}/edit`)}
                    >
                        Edit
                    </span>
                )}
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 space-y-4 mt-8">
                <div className="grid grid-cols-3 py-4">
                    <h5 className="dark:text-white">Full Name</h5>
                    {profile.fullname ? (
                        <span className="text-gray-600 dark:text-gray-400 col-span-2">{profile.fullname}</span>
                    ) : (
                        <span className="text-gray-300 italic">Name not set.</span>
                    )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5 className="dark:text-white">Gender</h5>
                    {profile.info.gender ? (
                        <span className="text-gray-600 dark:text-gray-400 col-span-2 capitalize">{profile.info.gender}</span>
                    ) : (
                        <span className="text-gray-300 italic">Gender not set.</span>
                    )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5 className="dark:text-white">Birthday</h5>
                    {profile.info.birthday ? (
                        <span className="text-gray-600 dark:text-gray-400 col-span-2">{dayjs(profile.info.birthday).format('MMM.DD, YYYY')}</span>
                    ) : (
                        <span className="text-gray-300 italic">Birthday not set.</span>
                    )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5 className="dark:text-white">Bio</h5>
                    {profile.info.bio ? (
                        <span className="text-gray-600 dark:text-gray-400 col-span-2">{profile.info.bio}</span>
                    ) : (
                        <span className="text-gray-300 italic">Bio not set.</span>
                    )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5 className="dark:text-white">Date Joined</h5>
                    <span className="text-gray-600 dark:text-gray-400 col-span-2">{dayjs(profile.dateJoined).format('MMM.DD, YYYY')}</span>
                </div>
            </div>
        </div>
    );
};

export default Info;
