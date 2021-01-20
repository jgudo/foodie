import { MessageOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from '~/components/shared/Badge';
import Loader from '~/components/shared/Loader';
import { initiateChat } from '~/redux/action/chatActions';
import { getMessages, getUnreadMessages, readMessage } from '~/services/api';
import socket from "~/socket/socket";
import { IError, IMessage, IRootReducer, IUser } from "~/types/types";
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
    const [error, setError] = useState<IError | null>(null);
    const [messages, setMessages] = useState<IMessageState>({
        items: [],
        totalUnseen: 0
    });
    const dispatch = useDispatch();
    const isMessagesOpenRef = useRef(isMessagesOpen);


    useEffect(() => {
        isMessagesOpenRef.current = isMessagesOpen;
    }, [isMessagesOpen]);

    useEffect(() => {
        if (isMessagesOpen) {
            fetchMessages();
        }

        socket.on('newMessage', (newMessage: IMessage) => {
            const updated = messages.items
                .filter((msg) => {
                    const arr = [msg.from.username, msg.to.username];

                    if (arr.includes(newMessage.from.username) && arr.includes(newMessage.to.username)) {
                        return newMessage;
                    }
                    return msg;
                });
            const sorted = updated.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);

            setMessages({
                items: sorted,
                totalUnseen: newMessage.from.id === id ? 0 : messages.totalUnseen + 1
            });
        });

        document.addEventListener('click', handleClickOutside);

        getUnreadMessages()
            .then(({ count }) => {
                setMessages({ ...messages, totalUnseen: count });
            });

        return () => {
            socket.emit('userDisconnect', id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e: Event) => {
        const toggle = (e.target as HTMLElement).closest('.messages-toggle');
        const wrapper = (e.target as HTMLElement).closest('.messages-wrapper');
        const seeMoreButton = (e.target as HTMLElement).closest('.see-more-button');

        if (!toggle && isMessagesOpenRef.current && !wrapper && !seeMoreButton) {
            setMessagesOpen(false);
        }
    }

    const fetchMessages = async (initOffset = 0) => {
        try {
            setLoading(true);
            setError(null);
            const { messages: items, totalUnseen } = await getMessages({ offset: initOffset });

            setMessages({
                items: [...messages.items, ...items],
                totalUnseen
            });
            setOffset(offset + 1);
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    };

    const handleReadMessage = async (sender: IUser) => {
        try {
            dispatch(initiateChat(sender));

            console.log(sender);
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
        if (!isMessagesOpen && messages.items.length === 0) {
            fetchMessages();
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
                    <div className="px-4 py-3 border-b-gray-200 flex justify-between items-center bg-indigo-700 rounded-t-md">
                        <h6 className="text-white">Messages</h6>
                    </div>
                    {(isLoading && !error && messages.items.length === 0) && (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    )}
                    {(messages.items.length === 0 && error) && (
                        <div className="flex justify-center py-6">
                            <p className="text-gray-400 italic">{error?.error?.message || 'You have no messages.'}</p>
                        </div>
                    )}
                    {(messages.items.length !== 0) && (
                        <MessagesList
                            messages={messages.items}
                            userID={id}
                            handleReadMessage={handleReadMessage}
                        />
                    )}
                    {(!isLoading && !error && messages.items.length !== 0) && (
                        <div className="see-more-button flex items-center justify-center py-4" onClick={() => fetchMessages(offset)}>
                            <span className="text-indigo-700 text-sm font-medium">
                                See more...
                        </span>
                        </div>
                    )}
                    {(isLoading && !error && messages.items.length !== 0) && (
                        <div className="flex items-center justify-center py-4">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Messages;
