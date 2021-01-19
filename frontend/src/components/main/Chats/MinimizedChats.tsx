import { useDispatch } from "react-redux";
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
                    className="w-12 h-12 cursor-pointer shadow-md hover:border-2 hover:border-indigo-500 hover:opacity-90 !bg-cover !bg-no-repeat rounded-full mr-2 my-4 border border-indigo-700"
                    key={chat.username}
                    title={chat.username}
                    style={{ background: `#f8f8f8 url(${chat.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    onClick={() => dispatch(initiateChat(chat))}
                />
            ))}
        </div>
    );
};

export default MinimizedChats;

