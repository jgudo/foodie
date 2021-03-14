import { CloseOutlined, CommentOutlined, LineOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Avatar, Loader } from "~/components/shared";
import { displayTime } from "~/helpers/utils";
import { useDidMount } from "~/hooks";
import { closeChat, getMessagesSuccess, minimizeChat, newMessageArrived } from "~/redux/action/chatActions";
import { getUserMessages, sendMessage } from "~/services/api";
import socket from "~/socket/socket";
import { IChatItemsState, IError, IMessage, IUser } from "~/types/types";

interface IProps {
    target: IChatItemsState;
    user: IUser;
}

const ChatBox: React.FC<IProps> = ({ user, target }) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const [error, setError] = useState<IError | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [isSending, setSending] = useState(false);
    const didMount = useDidMount(true);
    const [isTyping, setIsTyping] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let dummyEl = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (target.chats.length === 0) fetchMessages();

        socket.on('newMessage', (message: IMessage) => {
            dispatch(newMessageArrived(target.username, message));

            if (dummyEl.current) {
                dummyEl.current.scrollIntoView();
            }
        });

        socket.on('typing', (state: boolean) => {
            setIsTyping(state);
        });

        if (dummyEl.current) {
            dummyEl.current.scrollIntoView();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onMinimize = () => {
        dispatch(minimizeChat(target.username));
    }

    const onCloseChat = () => {
        dispatch(closeChat(target.username))
    }

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const messages = await getUserMessages(target.id, { offset: target.offset });

            dispatch(getMessagesSuccess(target.username, messages.reverse()));

            if (didMount) {
                setText('');
                setLoading(false);
                setError(null);
            }


            if (!target.offset || target.offset < 1) {
                dummyEl.current?.scrollIntoView();
            }
        } catch (e) {
            if (didMount) {
                setLoading(false);
                setError(e);
            }
        }
    }

    const dispatchSendMessage = async () => {
        if (text) {
            try {
                setSending(true);

                await sendMessage(text, target.id);

                if (didMount) {
                    setSending(false);
                    setText('');
                    setError(null);
                }
            } catch (e) {
                if (didMount) {
                    setSending(false);
                    setError(e);
                }
            }
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (text) {
                dispatchSendMessage();
                socket.emit('user-typing', { user: target, state: false });
            }
        } else {
            socket.emit('user-typing', { user: target, state: true });

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                socket.emit('user-typing', { user: target, state: false })
            }, 2000);
        }
    }

    return (
        <div className={`bg-white dark:bg-indigo-1100 p-3 relative w-full h-full laptop:w-20rem laptop:shadow-lg laptop:rounded-t-xl laptop:bottom-0 laptop:right-24 laptop:border laptop:border-gray-400 dark:border-gray-800`}>
            <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <Link className="dark:text-indigo-400" to={`/user/${target.username}`}>
                    <div className="flex items-center">
                        <Avatar url={target.profilePicture?.url} className="mr-2" />
                        <h5>{target.username}</h5>
                    </div>
                </Link>
                <div className="hidden laptop:flex laptop:items-center">
                    <div
                        className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1000"
                        title="Minimize Chat"
                        onClick={onMinimize}
                    >
                        <LineOutlined className="flex items-center justify-center" />
                    </div>
                    <div
                        className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1000"
                        title="Close Chat"
                        onClick={onCloseChat}
                    >
                        <CloseOutlined className="flex items-center justify-center" />
                    </div>
                </div>
            </div>
            {/* --- MESSAGES BODY ---- */}
            <div className="min-h-80% laptop:min-h-24rem max-h-85% laptop:max-h-80 bg-gray-100 dark:bg-indigo-1000 overflow-y-scroll pb-4 scrollbar relative">
                {(isLoading && target.chats.length === 0 && !error) && (
                    <div className="flex justify-center min-h-18rem py-2">
                        <Loader />
                    </div>
                )}
                {(!isLoading && target.chats.length === 0 && error) && (
                    <div className="flex flex-col items-center min-h-18rem justify-center py-2">
                        {error.status_code === 404 ? (
                            <>
                                <CommentOutlined className="text-gray-300 text-6xl" />
                                <span className="text-gray-400 mb-2">No messages.</span>
                                <span className="text-gray-400 text-sm">Send a message to {target.username}</span>
                            </>
                        ) : (
                            <span className="text-gray-400 mb-4">
                                {error?.error?.message || 'Unable to process your request.'}
                            </span>
                        )}
                    </div>
                )}
                {(!error && target.chats.length >= 10) && (
                    <>
                        {!isLoading ? (
                            <div
                                className={`flex justify-center items-center py-2 mb-4 bg-indigo-100 cursor-pointer`}
                                onClick={fetchMessages}
                            >
                                <span className="text-indigo-700 text-xs">Older messages</span>
                            </div>
                        ) : (
                            <div className="flex justify-center py-2 mb-4">
                                <Loader />
                            </div>
                        )}
                    </>
                )}
                {(target.chats.length !== 0) && (
                    <>
                        <TransitionGroup component={null}>
                            {target.chats.map((msg, i) => (
                                <CSSTransition
                                    timeout={500}
                                    classNames="fade"
                                    key={msg.id}
                                >
                                    <div className="flex flex-col">
                                        <div
                                            className={`flex p-2  ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                            key={`${msg.id}_${msg.from.id}`}
                                        >
                                            <div className="flex">
                                                {/* -- AVATAR --- */}
                                                <Avatar
                                                    url={msg.isOwnMessage ? user.profilePicture?.url : target.profilePicture?.url}
                                                    size="xs"
                                                    className={`self-end flex-shrink-0 !bg-cover !bg-no-repeat rounded-full ${msg.isOwnMessage ? 'ml-1 order-2' : 'mr-1 order-1'}`}
                                                />
                                                {/*  -- MESSAGE-- */}
                                                <span
                                                    className={`py-2 px-3 break-all text-sm rounded-xl ${msg.isOwnMessage ? 'bg-indigo-700 text-white order-1' : 'bg-gray-300 order-2'}`}>
                                                    {msg.text}
                                                </span>
                                                <span ref={dummyEl}></span>
                                            </div>
                                        </div>
                                        <div className={`flex pb-2 ${msg.isOwnMessage ? 'justify-end mr-8' : 'justify-start ml-8'}`}>
                                            {/* ---DATE ---- */}
                                            <span className={`text-gray-400 text-1xs ${msg.isOwnMessage ? 'order-2' : 'order-1'}`}>
                                                {displayTime(msg.createdAt, true)}
                                            </span>
                                            {/* ---- SEEN ---- */}
                                            {(msg.isOwnMessage && msg.seen && i === target.chats.length - 1) && (
                                                <span className={`text-gray-400 mx-2 text-1xs italic flex-grow ${msg.isOwnMessage ? 'order-1' : 'order-2'}`}>
                                                    &nbsp;Seen
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                        {isTyping && (
                            <div className="flex justify-center py-2">
                                <span className="text-xs text-gray-400">{target.username} is typing...</span>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="relative bottom-0 left-0 bg-white dark:bg-indigo-1100 w-full flex p-2 border-t border-gray-200 dark:border-gray-800">
                <input
                    className="flex-grow !border-gray-400 !rounded-r-none !py-0 dark:bg-indigo-1000 dark:text-white dark:!border-gray-800"
                    type="text"
                    onChange={handleTextChange}
                    onKeyDown={handleTextKeyDown}
                    readOnly={isSending || isLoading}
                    placeholder="Send a message..."
                    value={text}
                />
                <button
                    className="!rounded-l-none flex items-center justify-center"
                    disabled={isSending || isLoading}
                    onClick={dispatchSendMessage}
                >
                    <SendOutlined className="flex items-center justify-center text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
