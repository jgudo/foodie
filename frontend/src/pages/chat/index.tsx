import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ChatBox } from "~/components/main";
import { PageNotFound } from "~/pages";
import { IRootReducer } from "~/types/types";

const Chat: React.FC<RouteComponentProps<{ username: string }>> = ({ match }) => {
    const { username } = match.params;
    const { target, user } = useSelector((state: IRootReducer) => ({
        target: state.chats.items.find(chat => chat.username === username),
        user: state.auth
    }));

    return !target ? <PageNotFound /> : (
        <div className="relative w-full h-screen pt-14">
            <ChatBox
                user={user}
                target={target}
            />
        </div>
    );
};

export default Chat;
