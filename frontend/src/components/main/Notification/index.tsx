import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Badge from '~/components/shared/Badge';
import {
    getNotifications,
    getUnreadNotifications,

    markAllAsUnreadNotifications, readNotification
} from "~/services/api";
import socket from "~/socket/socket";
import { INotification, IRootReducer } from "~/types/types";
import NotificationList from "./NotificationList";

const Notification: React.FC = () => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any>({
        items: [],
        count: 0
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
            setUnreadCount(unreadCount + 1);
            setNotifications((prev: any) => ({ ...prev, items: [notification, ...prev.items] }));

            console.log(notification);
        });

        socket.on('notifyLike', ({ notification, count }: { notification: INotification, count: number }) => {
            console.log('STATE: ', notifications);
            setUnreadCount(unreadCount + 1);
            setNotifications((prev: any) => ({ ...prev, items: [notification, ...prev.items] }));

            console.log(notification);
        });

        getUnreadNotifications()
            .then(({ count }) => {
                setUnreadCount(count);
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
        setUnreadCount(0);
        setNotificationOpen(!isNotificationOpen);

        // Since setting state is asynchronous, we should flip the value of isNotificationOpen
        if (!isNotificationOpen && notifications.items.length === 0) {
            fetchNotifications();
        }
    }

    const handleReadNotification = async (id: string) => {
        try {
            const { state } = await readNotification(id);
            const updatedNotifs = notifications.items.map((notif: INotification) => {
                if (notif.id === id) {
                    return {
                        ...notif,
                        unread: state
                    }
                }
                return notif;
            });
            setNotifications({ ...notifications, items: updatedNotifs });
        } catch (e) {
            console.log(e);
        }
    };

    const handleMarkAllUnread = async () => {
        try {
            const { state } = await markAllAsUnreadNotifications();
            const updatedNotifs = notifications.items.map((notif: INotification) => {
                return {
                    ...notif,
                    unread: state
                }
            });
            setNotifications({ ...notifications, items: updatedNotifs });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="relative">
            <Badge count={unreadCount}>
                <BellOutlined
                    className="notification-toggle text-xl focus:outline-none"
                    onClick={toggleNotification}
                />
            </Badge>
            {isNotificationOpen && (
                <div className="notification-wrapper absolute top-10 right-0 w-30rem bg-white shadow-lg rounded-md">
                    {/*  ----- HEADER ----- */}
                    <div className="p-4 border-b-gray-200 flex justify-between items-center bg-indigo-700 rounded-t-md">
                        <h6 className="text-white">Notifications</h6>
                        <span
                            className="text-sm  p-2 text-white opacity-80 rounded-md hover:bg-indigo-500"
                            onClick={handleMarkAllUnread}
                        >
                            Mark all as read
                        </span>
                    </div>
                    {/* ----- LIST ---- */}
                    <NotificationList
                        notifications={notifications.items}
                        readNotification={handleReadNotification}
                        toggleNotification={setNotificationOpen}
                    />
                </div>
            )}
        </div>
    );
};

export default Notification;
