import UserCard from "~/components/main/UserCard";
import { IProfile } from "~/types/types";

interface IProps {
    users: IProfile[];
}

const Users: React.FC<IProps> = ({ users }) => {
    return (
        <div>
            {users.map((user) => (
                <div className="bg-white rounded-md mb-4 shadow-md" key={user._id}>
                    <UserCard
                        profile={user}
                        isFollowing={user.isFollowing}
                    />
                </div>
            ))}
        </div>
    );
};

export default Users;
