import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { IRootReducer } from "~/types/types";

const Info = () => {
    const profile = useSelector((state: IRootReducer) => state.profile);

    return (
        <div className="p-4 bg-white rounded-md min-h-10rem shadow-lg">
            <h3 className="text-gray-500">Info</h3>
            <div className="divide-y divide-gray-100 space-y-4 mt-8">
                <div className="grid grid-cols-3 py-4">
                    <h5>Full Name</h5>
                    {profile.fullname ? (
                        <span className="text-gray-600 col-span-2">{profile.fullname}</span>
                    ) : (
                            <span className="text-gray-300 italic">Name not set.</span>
                        )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5>Gender</h5>
                    {profile.info.gender ? (
                        <span className="text-gray-600 col-span-2">{profile.info.gender}</span>
                    ) : (
                            <span className="text-gray-300 italic">Gender not set.</span>
                        )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5>Birthday</h5>
                    {profile.info.birthday ? (
                        <span className="text-gray-600 col-span-2">{dayjs(profile.info.birthday)}</span>
                    ) : (
                            <span className="text-gray-300 italic">Birthday not set.</span>
                        )}
                </div>
                <div className="grid grid-cols-3 py-4">
                    <h5>Bio</h5>
                    {profile.info.bio ? (
                        <span className="text-gray-600 col-span-2">{profile.info.bio}</span>
                    ) : (
                            <span className="text-gray-300 italic">Bio not set.</span>
                        )}
                </div>
            </div>
        </div>
    );
};

export default Info;
