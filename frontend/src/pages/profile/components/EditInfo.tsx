import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { IRootReducer } from "~/types/types";

const EditInfo: React.FC = () => {
    const { isOwnProfile, username } = useSelector((state: IRootReducer) => ({
        username: state.profile.username,
        isOwnProfile: state.auth.username === state.profile.username
    }));

    return (!isOwnProfile && username) ? <Redirect to={`/${username}`} /> : (
        <div className="p-4 bg-white rounded-md min-h-10rem shadow-lg">
            <h3 className="text-gray-500">Edit Info</h3>

        </div>
    );
};

export default EditInfo;
