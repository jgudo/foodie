import { CheckOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDidMount } from "~/hooks";
import { followUser, unfollowUser } from "~/services/api";

interface IProps {
    isFollowing: boolean;
    userID: string;
    size?: string;
}

const FollowButton: React.FC<IProps> = (props) => {
    const [isFollowing, setIsFollowing] = useState(props.isFollowing);
    const [isLoading, setLoading] = useState(false);
    const didMount = useDidMount();

    useEffect(() => {
        setIsFollowing(props.isFollowing);
    }, [props.isFollowing])

    const dispatchFollow = async () => {
        try {
            setLoading(true);
            if (isFollowing) {
                const result = await unfollowUser(props.userID);
                didMount && setIsFollowing(result.state);
            } else {
                const result = await followUser(props.userID);
                didMount && setIsFollowing(result.state);
            }

            didMount && setLoading(false);
        } catch (e) {
            didMount && setLoading(false);
            console.log(e);
        }
    };

    return (
        <button
            className={`${isFollowing && 'hover:bg-gray-200 bg-indigo-100 !border !border-indigo-500 text-indigo-700 dark:bg-indigo-1100 dark:text-indigo-400 dark:hover:bg-indigo-900 dark:hover:text-white'} flex items-center ${props.size === 'sm' && '!py-2 !px-3 !text-sm'}`}
            disabled={isLoading}
            onClick={dispatchFollow}
        >
            {isFollowing ? <CheckOutlined /> : <UserAddOutlined />}
                &nbsp;&nbsp;
            <span className={`${props.size === 'sm' && 'text-sm'}`}>
                {isLoading
                    ? 'Following'
                    : !isLoading && !isFollowing
                        ? 'Follow'
                        : 'Following'}
            </span>
        </button>
    );
};

export default FollowButton;
