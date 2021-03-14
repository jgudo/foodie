import { useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Avatar from "~/components/shared/Avatar";
import { initiateChat } from "~/redux/action/chatActions";
import { IChatItemsState } from "~/types/types";

interface IProps {
    users: IChatItemsState[]
}

const MinimizedChats: React.FC<IProps> = ({ users }) => {
    const dispatch = useDispatch();

    return (
        <div className="p-4 absolute bottom-0 right-0">
            <TransitionGroup component={null}>
                {users.map(chat => chat.minimized && (
                    <CSSTransition
                        timeout={500}
                        classNames="fade"
                        key={chat.username}
                    >
                        <div
                            key={chat.username}
                            onClick={() => dispatch(initiateChat(chat))}
                            title={chat.username}
                        >
                            <Avatar
                                url={chat.profilePicture?.url}
                                size="lg"
                                className="cursor-pointer shadow-md hover:border-2 hover:border-indigo-500 hover:opacity-90  mr-2 my-4 border border-indigo-700"
                            />
                        </div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
};

export default MinimizedChats;

