import { useDispatch } from "react-redux";
import Avatar from "~/components/shared/Avatar";
import { initiateChat } from "~/redux/action/chatActions";
import { IChatItemsState } from "~/types/types";

interface IProps {
    users: IChatItemsState[]
}

const MinimizedChats: React.FC<IProps> = ({ users }) => {
    const dispatch = useDispatch();

    return (
        <div className="p-4 absolute bottom-0 right-2">
            {users.map(chat => chat.minimized && (
                <div
                    key={chat.username}
                    onClick={() => dispatch(initiateChat(chat))}
                    title={chat.username}
                >
                    <Avatar
                        url={chat.profilePicture}
                        size="lg"
                        className="cursor-pointer shadow-md hover:border-2 hover:border-indigo-500 hover:opacity-90  mr-2 my-4 border border-indigo-700"
                    />
                </div>
            ))}
        </div>
    );
};

export default MinimizedChats;

