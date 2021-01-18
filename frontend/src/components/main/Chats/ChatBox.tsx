import { CloseOutlined, LineOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "~/components/shared/Loader";
import { closeChat, getMessagesSuccess, minimizeChat, newMessageArrived } from "~/redux/action/chatActions";
import { getUserMessages, sendMessage } from "~/services/api";
import socket from "~/socket/socket";
import { IChatItemsState, IMessage, IUser } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    target: IChatItemsState;
    user: IUser;
}

const ChatBox: React.FC<IProps> = ({ user, target }) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isSending, setSending] = useState(false);
    let isMountedRef = useRef<boolean | null>(null);
    let dummyEl = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (target.chats.length === 0) fetchMessages();
        if (isMountedRef) isMountedRef.current = true;

        socket.on('newMessage', (message: IMessage) => {
            console.log('CHATBOX: ', message);

            if (isMountedRef.current) {
                dispatch(newMessageArrived(target.username, message));
            }

            if (dummyEl.current) {
                dummyEl.current.scrollIntoView();
            }
        });


        return () => {
            if (isMountedRef) isMountedRef.current = false;
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

            if (messages.length === 0) {
                if (isMountedRef.current) setError('No messages.');
            } else {
                dispatch(getMessagesSuccess(target.username, messages.reverse()));
            }

            if (isMountedRef.current) {
                setText('');
                setLoading(false);
            }
        } catch (e) {
            if (isMountedRef.current) {
                setLoading(false);
                setError(e.error.message);
            }
        }
    }

    const dispatchSendMessage = async () => {
        try {
            setSending(true);

            await sendMessage(text, target.id);

            if (isMountedRef.current) {
                setSending(false);
                setText('');
            }
        } catch (e) {
            if (isMountedRef.current) {
                setSending(false);
                setError(e.error.message);
            }
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    return (
        <div className="w-20rem bg-white shadow-md p-3 rounded-t-md relative bottom-0 right-24">
            <div className="flex justify-between pb-3 border-b border-gray-200">
                <Link to={`/user/${target.username}`}>
                    <div className="flex">
                        <div
                            className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                            style={{ background: `#f8f8f8 url(${target.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                        />
                        <h5>{target.username}</h5>
                    </div>
                </Link>
                <div className="flex items-center">
                    <div
                        className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={onMinimize}
                    >
                        <LineOutlined className="flex items-center justify-center" />
                    </div>
                    <div
                        className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={onCloseChat}
                    >
                        <CloseOutlined className="flex items-center justify-center" />
                    </div>
                </div>
            </div>
            {/* --- MESSAGES BODY ---- */}
            <div className="min-h-18rem max-h-80 p-2 bg-gray-100 overflow-y-scroll">
                {(isLoading && target.chats.length === 0 && !error) && (
                    <div className="flex justify-center h-full py-2">
                        <Loader />
                    </div>
                )}
                {(!isLoading && target.chats.length === 0 && error) && (
                    <div className="flex justify-center py-2">
                        <span className="text-gray-400">No messages.</span>
                    </div>
                )}
                {(!isLoading && !error && target.chats.length !== 0) && (
                    <div className={`flex justify-center items-center py-2 mb-4 bg-indigo-100 cursor-pointer`}>
                        <span className="text-indigo-700 text-xs">Older messages</span>
                    </div>
                )}
                {(!isLoading && !error) && target.chats.map(msg => {
                    return (
                        <div className="flex flex-col">
                            <div
                                className={`flex mb-1  ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                key={msg.id}
                            >
                                <div className="flex">
                                    {/* -- AVATAR --- */}
                                    <div
                                        className={`w-5 h-5 self-end !bg-cover !bg-no-repeat rounded-full ${msg.isOwnMessage ? 'ml-1 order-2' : 'mr-1 order-1'}`}
                                        style={{ background: `#f8f8f8 url(${msg.isOwnMessage ? user.profilePicture : target.profilePicture}` }}
                                    />
                                    {/*  -- MESSAGE-- */}
                                    <span
                                        className={`py-2 px-3  text-sm rounded-xl ${msg.isOwnMessage ? 'bg-indigo-700 text-white order-1' : 'bg-gray-300 order-2'}`}>
                                        {msg.text}
                                    </span>
                                    <span ref={dummyEl}></span>
                                </div>
                            </div>
                            <div className={`flex pb-2 ${msg.isOwnMessage ? 'justify-end mr-8' : 'justify-start ml-8'}`}>
                                <span className="text-gray-400 text-xs">{dayjs(msg.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex pt-3 border-t border-gray-200">
                <input
                    className="flex-grow !rounded-r-none !py-0"
                    type="text"
                    onChange={handleTextChange}
                    readOnly={isSending}
                    placeholder="Send a message..."
                />
                <button
                    className="!rounded-l-none flex items-center justify-center"
                    disabled={isSending}
                    onClick={dispatchSendMessage}
                >
                    <SendOutlined className="flex items-center justify-center text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
