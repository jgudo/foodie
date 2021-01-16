import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useSelector } from "react-redux";
import Badge from '~/components/shared/Badge';
import Loader from '~/components/shared/Loader';
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
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState<any>({
        items: [],
        count: 0
    });

    useEffect(() => {
        if (isNotificationOpen) {
            fetchNotifications();
        }

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

        socket.on('notifyComment', ({ notification, count }: { notification: INotification, count: number }) => {
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
            setLoading(true);
            setError('');
            const notifs = await getNotifications({ offset });

            setNotifications({
                items: [...notifications.items, ...notifs.notifications],
                count: notifs.count,
                unreadCount: notifs.unreadCount
            });
            setOffset(offset + 1);
            setLoading(false);

            if (notifs.notifications.length === 0) {
                setError('No more notifications.')
            }
        } catch (e) {
            setLoading(false);
            setError(e.error.message);
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
        if (notifications.items.length === 0) return;

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

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && notifications.items.length !== 0,
        onLoadMore: fetchNotifications,
        scrollContainer: 'parent',
        threshold: 200
    });

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
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    ) : (
                            <div ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                                <NotificationList
                                    notifications={notifications.items}
                                    readNotification={handleReadNotification}
                                    toggleNotification={setNotificationOpen}
                                />
                                {(notifications.items.length !== 0 && !error && isLoading) && (
                                    <div className="flex justify-center py-2">
                                        <Loader />
                                    </div>
                                )}
                                {(notifications.items.length !== 0 && error) && (
                                    <div className="flex justify-center py-6">
                                        <p className="text-gray-400 italic">{error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export default Notification;
