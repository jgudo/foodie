import UserCard from "~/components/main/UserCard";
import useDocumentTitle from "~/hooks/useDocumentTitle";
import { IProfile } from "~/types/types";

interface IProps {
    users: IProfile[];
}

const Users: React.FC<IProps> = ({ users }) => {
    useDocumentTitle(`Search Users | Foodie`);

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
