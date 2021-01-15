import { useSelector } from "react-redux";
import { IRootReducer } from "~/types/types";
import ChatBox from "./ChatBox";
import MinimizedChats from "./MinimizedChats";

const Chats = () => {
    const chats = useSelector((state: IRootReducer) => state.chats);

    return (
        <div className="fixed bottom-0 right-0">
            {chats.items.map(chat => chats.active === chat.id && (
                <ChatBox key={chat.id} user={chat} />
            ))}
            <MinimizedChats users={chats.items} />
        </div>
    )
};

export default Chats;
