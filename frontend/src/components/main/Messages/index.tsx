import { FormOutlined, MessageOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import Badge from '~/components/shared/Badge';
import Loader from '~/components/shared/Loader';
import useModal from '~/hooks/useModal';
import { initiateChat } from '~/redux/action/chatActions';
import { getMessages, getUnreadMessages, readMessage } from '~/services/api';
import socket from "~/socket/socket";
import { IError, IMessage, IRootReducer, IUser } from "~/types/types";
import ComposeMessageModal from '../Modals/ComposeMessageModal';
import MessagesList from "./MessagesList";


const Messages: React.FC<{ isAuth: boolean; }> = ({ isAuth }) => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isMessagesOpen, setMessagesOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState<IError | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [count, setCount] = useState(0);
    const dispatch = useDispatch();
    const composeModal = useModal();
    const history = useHistory();
    const isMessagesOpenRef = useRef(isMessagesOpen);


    useEffect(() => {
        isMessagesOpenRef.current = isMessagesOpen;
    }, [isMessagesOpen]);

    useEffect(() => {
        if (isMessagesOpen) {
            fetchMessages();
        }

        socket.on('newMessage', (newMessage: IMessage) => {
            const updated = messages
                .filter((msg) => {
                    const arr = [msg.from.username, msg.to.username];

                    if (arr.includes(newMessage.from.username) && arr.includes(newMessage.to.username)) {
                        return newMessage;
                    }
                    return msg;
                });
            const sorted = updated.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);

            setMessages(sorted);
            setCount(newMessage.isOwnMessage ? 0 : count + 1);
        });

        document.addEventListener('click', handleClickOutside);

        if (isAuth) {
            getUnreadMessages()
                .then((result) => {
                    setCount(result.count);
                });
        }

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
            const result = await getMessages({ offset: initOffset });

            setMessages([...messages, ...result]);
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
            setMessagesOpen(false);

            await readMessage(sender.id);
            const updated = messages.map((msg) => {
                if (msg.from.id === sender.id) {
                    return {
                        ...msg,
                        seen: true
                    }
                }

                return msg;
            });

            setMessages(updated);

            if (window.screen.width < 800) {
                history.push(`/chat/${sender.username}`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const toggleMessages = () => {
        setMessagesOpen(!isMessagesOpen);
        setCount(0);

        // Since setting state is asynchronous, we should flip the value of isMessagesOpen
        if (!isMessagesOpen && messages.length === 0) {
            fetchMessages();
        }
    }

    const onClickCompose = () => {
        composeModal.openModal();
        setMessagesOpen(false);
    }

    return (
        <div className="relative">
            <div onClick={toggleMessages}>
                <Badge count={count}>
                    <MessageOutlined className="messages-toggle flex items-center justify-center text-xl focus:outline-none" />
                </Badge>
            </div>
            {isMessagesOpen && (
                <div className="messages-wrapper h-screen laptop:h-auto fixed top-14 laptop:top-10 pb-14 laptop:pb-0 right-0 w-full laptop:w-30rem bg-white shadow-lg laptop:rounded-md laptop:absolute">
                    {/*  ----- HEADER ----- */}
                    <div className="px-4 py-2 border-b-gray-200 flex justify-between items-center bg-indigo-700 laptop:rounded-t-md">
                        <h6 className="text-white">Messages</h6>
                        <span
                            className="text-sm flex p-2 text-white rounded-md hover:bg-indigo-500"
                            onClick={onClickCompose}
                        >
                            <FormOutlined className="flex items-center justify-center mr-2" />
                            Compose
                        </span>
                    </div>
                    {(isLoading && !error && messages.length === 0) && (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    )}
                    {(messages.length === 0 && error) && (
                        <div className="flex justify-center py-6">
                            <p className="text-gray-400 italic">{error?.error?.message || 'You have no messages.'}</p>
                        </div>
                    )}
                    {(messages.length !== 0) && (
                        <MessagesList
                            messages={messages}
                            userID={id}
                            handleReadMessage={handleReadMessage}
                        />
                    )}
                    {(!isLoading && !error && messages.length >= 10) && (
                        <div className="see-more-button flex items-center justify-center py-4" onClick={() => fetchMessages(offset)}>
                            <span className="text-indigo-700 text-sm font-medium">
                                See more...
                        </span>
                        </div>
                    )}
                    {(isLoading && !error && messages.length !== 0) && (
                        <div className="flex items-center justify-center py-4">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
            <ComposeMessageModal
                isOpen={composeModal.isOpen}
                openModal={composeModal.openModal}
                closeModal={composeModal.closeModal}
                userID={id}
            />
        </div>
    );
};

export default Messages;
