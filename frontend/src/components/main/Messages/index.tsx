import { MessageOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from '~/components/shared/Badge';
import Loader from '~/components/shared/Loader';
import { initiateChat } from '~/redux/action/chatActions';
import { getMessages, getUnreadMessages, readMessage } from '~/services/api';
import socket from "~/socket/socket";
import { IMessage, IRootReducer, IUser } from "~/types/types";
import MessagesList from "./MessagesList";

interface IMessageState {
    items: IMessage[],
    totalUnseen: number;
}

const Messages: React.FC = () => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isMessagesOpen, setMessagesOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState('');
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [messages, setMessages] = useState<IMessageState>({
        items: [],
        totalUnseen: 0
    });
    const dispatch = useDispatch();

    useEffect(() => {
        if (isMessagesOpen) {
            fetchMessages();
        }

        socket.on('newMessage', (message: IMessage) => {
            console.log(message);
            if (message.from.id !== id) {
                setMessages({ ...messages, totalUnseen: messages.totalUnseen + 1 });
            }

            setHasNewMessage(true);
        });

        getUnreadMessages()
            .then(({ count }) => {
                setMessages({ ...messages, totalUnseen: count });
            });

        return () => {
            socket.emit('userDisconnect', id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    document.addEventListener('click', (e: Event) => {
        const toggle = (e.target as HTMLElement).closest('.messages-toggle');
        const wrapper = (e.target as HTMLElement).closest('.messages-wrapper');

        if (!toggle && isMessagesOpen && !wrapper) {
            setMessagesOpen(false);
        }
    });

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError('');
            const { items, totalUnseen } = await getMessages();

            setMessages({
                items: [...messages.items, ...items],
                totalUnseen
            });
            setOffset(offset + 1);
            setLoading(false);

            if (items.length === 0) {
                setError('No more messages.')
            }
        } catch (e) {
            setError(e.error.message);
            setLoading(false);
        }
    };

    const handleReadMessage = async (sender: IUser) => {
        try {
            dispatch(initiateChat(sender));

            await readMessage(sender.id);
            const updated = messages.items.map(msg => ({
                ...msg,
                unseenCount: 0,
                seen: true
            }));

            setMessagesOpen(false);
            setMessages({ items: updated, totalUnseen: 0 });
        } catch (e) {
            console.log(e);
        }
    }

    const toggleMessages = () => {
        setMessagesOpen(!isMessagesOpen);
        setMessages({ ...messages, totalUnseen: 0 });

        // Since setting state is asynchronous, we should flip the value of isMessagesOpen
        if ((!isMessagesOpen && messages.items.length === 0) || hasNewMessage) {
            fetchMessages();
            setHasNewMessage(false);
        }
    }

    return (
        <div className="relative">
            <Badge count={messages.totalUnseen}>
                <MessageOutlined
                    className="messages-toggle text-xl focus:outline-none"
                    onClick={toggleMessages}
                />
            </Badge>
            {isMessagesOpen && (
                <div className="messages-wrapper absolute top-10 right-0 w-30rem bg-white shadow-lg rounded-md">
                    {/*  ----- HEADER ----- */}
                    <div className="p-4 border-b-gray-200 flex justify-between items-center bg-indigo-700 rounded-t-md">
                        <h6 className="text-white">Messages</h6>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    ) : (
                            <MessagesList
                                messages={messages.items}
                                userID={id}
                                handleReadMessage={handleReadMessage}
                            />
                        )}
                </div>
            )}
        </div>
    );
};

export default Messages;
