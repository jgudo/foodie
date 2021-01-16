import { useSelector } from "react-redux";
import { IRootReducer } from "~/types/types";
import ChatBox from "./ChatBox";
import MinimizedChats from "./MinimizedChats";

const Chats = () => {
    const { chats, user } = useSelector((state: IRootReducer) => ({
        chats: state.chats,
        user: state.auth
    }));

    return (
        <div className="fixed bottom-0 right-0 z-50">
            {chats.items.map(chat => chats.active === chat.id && (
                <ChatBox key={chat.id} user={user} target={chat} />
            ))}
            <MinimizedChats users={chats.items} />
        </div>
    )
};

export default Chats;
