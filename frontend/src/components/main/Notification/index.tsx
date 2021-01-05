import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications } from "~/services/api";
import socket from "~/socket/socket";
import { INotification, IRootReducer } from "~/types/types";
import NotificationList from "./NotificationList";

const Notification: React.FC = () => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any>({
        items: [],
        count: 0,
        unreadCount: 0
    });

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('userConnect', id);
            console.log('Client connected to socket.');

            if (isNotificationOpen) {
                fetchNotifications();
            }
        });

        socket.on('notifyFollow', ({ notification, count }: { notification: INotification, count: number }) => {
            console.log('STATE: ', notifications);
            setNotifications((prev: any) => ({ ...prev, count: prev.count + count, items: [notification, ...prev.items] }))

            console.log(notification);
        });

        socket.on('notifyLike', ({ notification, count }: { notification: INotification, count: number }) => {
            console.log('STATE: ', notifications);
            setNotifications((prev: any) => ({ ...prev, count: prev.count + count, items: [notification, ...prev.items] }))

            console.log(notification);
        });


        return () => {
            socket.emit('userDisconnect', id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    document.addEventListener('click', (e: Event) => {
        const toggle = (e.target as HTMLElement).closest('.notification-toggle');
        const wrapper = (e.target as HTMLElement).closest('.notification-wrapper');

        if (!toggle && isNotificationOpen && !wrapper) {
            setNotificationOpen(false);
        }
    });

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

        // Since setting state is asynchronous, we should flip the value of isNotificationOpen
        if (!isNotificationOpen && notifications.items.length === 0) {
            fetchNotifications();
        }
    }

    return (
        <div className="relative">
            <BellOutlined
                className="notification-toggle text-xl focus:outline-none"
                onClick={toggleNotification}
            />
            {isNotificationOpen && (
                <div className="notification-wrapper absolute top-10 right-0 w-30rem bg-white shadow-lg rounded-md">
                    <NotificationList notifications={notifications.items} />
                </div>
            )}
        </div>
    );
};

export default Notification;
