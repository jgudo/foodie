import { StarOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Avatar from "~/components/shared/Avatar";

interface IProps {
    username: string;
    profilePicture?: string;
}

const SideMenu: React.FC<IProps> = ({ username, profilePicture }) => {
    return (
        <ul>
            <li className="px-4 py-3 cursor-pointer rounded-md hover:bg-indigo-100">
                <Link to={`/user/${username}`} className="flex items-center text-black">
                    <Avatar url={profilePicture} className="mr-4" />
                    <h6 className="text-sm">My Profile</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 rounded-md hover:bg-indigo-100">
                <Link to={`/user/${username}/following`} className="flex items-center text-black">
                    <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm">Following</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 rounded-md hover:bg-indigo-100">
                <Link to={`/user/${username}/followers`} className="flex items-center text-black">
                    <TeamOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm">Followers</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 rounded-md hover:bg-indigo-100">
                <Link to={`/user/${username}/bookmarks`} className="flex items-center text-black">
                    <StarOutlined className="text-indigo-700" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm">Bookmarks</h6>
                </Link>
            </li>
        </ul>
    )
};

export default SideMenu;
