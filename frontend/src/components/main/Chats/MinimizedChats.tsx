import { IChatItemsState } from "~/types/types";

interface IProps {
    users: IChatItemsState[]
}

const MinimizedChats: React.FC<IProps> = ({ users }) => {
    return (
        <div className="p-4 absolute bottom-0 right-4">
            {users.map(chat => chat.minimized && (
                <div
                    className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                    style={{ background: `#f8f8f8 url(${chat.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                />
            ))}
        </div>
    );
};

export default MinimizedChats;

