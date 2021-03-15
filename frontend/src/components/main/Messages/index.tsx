import { FormOutlined, MessageOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { ComposeMessageModal } from '~/components/main';
import { Badge, Loader } from '~/components/shared';
import { useModal } from '~/hooks';
import { initiateChat } from '~/redux/action/chatActions';
import { getMessages, getUnreadMessages, readMessage } from '~/services/api';
import socket from "~/socket/socket";
import { IError, IMessage, IRootReducer, IUser } from "~/types/types";
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
            setMessages((prevMessages) => updateNewMessages(prevMessages, newMessage));
            setCount((prevCount) => newMessage.isOwnMessage ? 0 : prevCount + 1);
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

    const updateNewMessages = (prevMessages: IMessage[], newMessage: IMessage) => {
        let messageOnList = false;
        const updated = prevMessages
            .map((msg) => {
                const arr = [msg.from.username, msg.to.username];

                if (arr.includes(newMessage.from.username) && arr.includes(newMessage.to.username)) {
                    messageOnList = true;
                    return newMessage;
                }

                return msg;
            });
        const sorted = updated.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);

        return messageOnList ? sorted : [newMessage, ...sorted];
    }

    const handleClickOutside = (e: Event) => {
        const toggle = (e.target as HTMLElement).closest('.messages-toggle');
        const wrapper = (e.target as HTMLElement).closest('.messages-wrapper');
        const seeMoreButton = (e.target as HTMLElement).closest('.see-more-button');

        if (!toggle && isMessagesOpenRef.current && !wrapper && !seeMoreButton) {
            setMessagesOpen(false);
        }
    }

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getMessages({ offset });

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

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && messages.length >= 10,
        onLoadMore: fetchMessages,
        scrollContainer: 'parent',
    });

    return (
        <div className="relative">
            <div onClick={toggleMessages}>
                <Badge count={count}>
                    <MessageOutlined className="messages-toggle text-xl focus:outline-none dark:text-white" />
                </Badge>
            </div>
            {isMessagesOpen && (
                <div className="messages-wrapper h-screen border border-transparent dark:border-gray-800 laptop:h-auto fixed top-14 laptop:top-10 pb-14 laptop:pb-0 right-0 w-full laptop:w-30rem bg-white dark:bg-indigo-1000 shadow-lg laptop:rounded-md laptop:absolute">
                    {/*  ----- HEADER ----- */}
                    <div className="px-4 py-2 border-b-gray-200 flex justify-between items-center bg-indigo-700 laptop:rounded-t-md">
                        <h6 className="text-white">Messages</h6>
                        <span
                            className="text-sm flex p-2 text-white rounded-md hover:bg-indigo-500"
                            onClick={onClickCompose}
                        >
                            <FormOutlined className="mr-2" />
                            Compose
                        </span>
                    </div>
                    {/* --- LOADER FIRST FETCH */}
                    {(isLoading && !error && messages.length === 0) && (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    )}
                    {/* --- ERROR MESSAGE ---- */}
                    {(messages.length === 0 && error) && (
                        <div className="flex justify-center py-6">
                            <p className="text-gray-400 italic">
                                {error.status_code === 404
                                    ? 'You have no messages.'
                                    : (error?.error?.message || 'Something went wrong :(')
                                }
                            </p>
                        </div>
                    )}
                    {/* --- MSG LIST --- */}
                    {(messages.length !== 0) && (
                        <MessagesList
                            messages={messages}
                            handleReadMessage={handleReadMessage}
                            infiniteScrollRef={infiniteRef}
                        />
                    )}
                    {/* ---- LOADER FETCHING MORE --- */}
                    {(isLoading && !error && messages.length !== 0) && (
                        <div className="flex items-center justify-center py-4">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
            {composeModal.isOpen && (
                <ComposeMessageModal
                    isOpen={composeModal.isOpen}
                    openModal={composeModal.openModal}
                    closeModal={composeModal.closeModal}
                    userID={id}
                />
            )}
        </div>
    );
};

export default Messages;
