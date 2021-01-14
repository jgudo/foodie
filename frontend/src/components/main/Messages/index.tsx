import { MessageOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Badge from '~/components/shared/Badge';
import Loader from '~/components/shared/Loader';
import socket from "~/socket/socket";
import { IRootReducer } from "~/types/types";
import MessagesList from "./MessagesList";

const Messages: React.FC = () => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isMessagesOpen, setMessagesOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [messages, setMessages] = useState<any>({
        items: [],
        count: 0
    });

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('userConnect', id);
            console.log('Client connected to socket.');

            if (isMessagesOpen) {
                fetchMessages();
            }
        });

        // socket.on('newMessage', ({ notification, count }: { notification: INotification, count: number }) => {
        // });

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
        } catch (e) {
        }
    };

    const toggleMessages = () => {
        setMessagesOpen(!isMessagesOpen);

        // Since setting state is asynchronous, we should flip the value of isMessagesOpen
        if (!isMessagesOpen && messages.items.length === 0) {
            fetchMessages();
        }
    }

    return (
        <div className="relative">
            <Badge count={0}>
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
                            <MessagesList messages={messages.items} />
                        )}
                </div>
            )}
        </div>
    );
};

export default Messages;
