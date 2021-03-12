import { StarOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar } from "~/components/shared";

interface IProps {
    username: string;
    profilePicture?: string;
}

const SideMenu: React.FC<IProps> = ({ username, profilePicture }) => {
    return (
        <ul className="overflow-hidden">
            <li className="px-4 py-3 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
                <Link to={`/user/${username}`} className="flex items-center text-black">
                    <Avatar url={profilePicture} className="mr-4" />
                    <h6 className="text-sm dark:text-white">My Profile</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-indigo-100  dark:hover:bg-indigo-900">
                <Link to={`/user/${username}/following`} className="flex items-center text-black">
                    <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Following</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-indigo-100  dark:hover:bg-indigo-900">
                <Link to={`/user/${username}/followers`} className="flex items-center text-black">
                    <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Followers</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-indigo-100  dark:hover:bg-indigo-900">
                <Link to={`/user/${username}/bookmarks`} className="flex items-center text-black">
                    <StarOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Bookmarks</h6>
                </Link>
            </li>
        </ul>
    )
};

export default SideMenu;
