import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications } from "~/services/api";
import socket from "~/socket/socket";
import { IRootReducer } from "~/types/types";
import NotificationList from "./NotificationList";

const Notification: React.FC = () => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState({
        items: [],
        count: 0,
        unreadCount: 0
    });

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('userConnect', id);
            console.log('COnnected');

            if (isNotificationOpen) {
                fetchNotifications();
            }
        });

        socket.on('notifyFollow', ({ notification, count }: any) => {
            console.log(notification);
        });
        return () => {
            socket.emit('userDisconnect', id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNotifications = async () => {
        try {
            const notifs = await getNotifications();
            setNotifications({
                items: notifs.notifications,
                count: notifs.count,
                unreadCount: notifs.unreadCount
            });
        } catch (e) {
            console.log(e);
        }
    };

    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
    }

    return (
        <div className="relative">
            <BellOutlined className=" text-xl focus:outline-none" onClick={toggleNotification} />
            {isNotificationOpen && (
                <div className="absolute top-10 right-0 w-30rem bg-white shadow-lg rounded-md">
                    <NotificationList notifications={notifications.items} />
                </div>
            )}
        </div>
    );
};

export default Notification;
