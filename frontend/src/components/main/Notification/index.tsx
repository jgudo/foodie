import { BellOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useSelector } from "react-redux";
import { Badge, Loader } from '~/components/shared';
import {
    getNotifications,
    getUnreadNotifications,
    markAllAsUnreadNotifications,
    readNotification
} from "~/services/api";
import socket from "~/socket/socket";
import { IError, INotification, IRootReducer } from "~/types/types";
import NotificationList from "./NotificationList";

interface IProps {
    isAuth: boolean;
}

const Notification: React.FC<IProps> = ({ isAuth }) => {
    const id = useSelector((state: IRootReducer) => state.auth.id);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [hasReadAll, setHasReadAll] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState<IError | null>(null);
    const [notifications, setNotifications] = useState<any>({
        items: [],
        count: 0
    });
    const isNotificationOpenRef = useRef(isNotificationOpen);

    useEffect(() => {
        isNotificationOpenRef.current = isNotificationOpen;
    }, [isNotificationOpen]);

    useEffect(() => {
        socket.on('newNotification', ({ notification, count }: { notification: INotification, count: number }) => {
            console.log('STATE: ', notifications);
            setUnreadCount(unreadCount + 1);
            setNotifications((prev: any) => ({ ...prev, items: [notification, ...prev.items] }));

            console.log(notification);
        });

        document.addEventListener('click', handleClickOutside);

        if (isAuth) {
            getUnreadNotifications()
                .then(({ count }) => {
                    setUnreadCount(count);
                });
        }

        return () => {
            socket.emit('userDisconnect', id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleClickOutside = (e: Event) => {
        const toggle = (e.target as HTMLElement).closest('.notification-toggle');
        const wrapper = (e.target as HTMLElement).closest('.notification-wrapper');

        if (!toggle && isNotificationOpenRef.current && !wrapper) {
            setNotificationOpen(false);
        }
    }

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            const notifs = await getNotifications({ offset });

            setNotifications({
                items: [...notifications.items, ...notifs.notifications],
                count: notifs.count,
                unreadCount: notifs.unreadCount
            });
            setOffset(offset + 1);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setError(e);
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
        if (notifications.items.length === 0 || hasReadAll) return;

        try {
            const { state } = await markAllAsUnreadNotifications();
            const updatedNotifs = notifications.items.map((notif: INotification) => {
                return {
                    ...notif,
                    unread: state
                }
            });
            setHasReadAll(true);
            setNotifications({ ...notifications, items: updatedNotifs });
        } catch (e) {
            console.log(e);
        }
    }

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && notifications.items.length >= 10,
        onLoadMore: fetchNotifications,
        scrollContainer: 'parent',
    });

    return (
        <div className="relative">
            <div onClick={toggleNotification}>
                <Badge count={unreadCount}>
                    <BellOutlined className="notification-toggle text-xl focus:outline-none dark:text-white" />
                </Badge>
            </div>
            {isNotificationOpen && (
                <div className="notification-wrapper border border-transparent dark:border-gray-800 fixed top-14 pb-14 laptop:pb-0 laptop:top-10 right-0 h-screen laptop:h-auto w-full laptop:w-30rem bg-white dark:bg-indigo-1000 shadow-lg rounded-md laptop:absolute"
                >
                    {/*  ----- HEADER ----- */}
                    <div className="py-2 px-4 border-b-gray-200 flex justify-between items-center bg-indigo-700 laptop:rounded-t-md">
                        <h6 className="text-white">Notifications</h6>
                        <span
                            className="text-sm  p-2 text-white opacity-80 rounded-md hover:bg-indigo-500"
                            onClick={handleMarkAllUnread}
                        >
                            Mark all as read
                        </span>
                    </div>
                    {/* ---- LOADER --- */}
                    {(isLoading && !error && notifications.items.length === 0) && (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    )}
                    {/* --- ERROR MESSAGE --- */}
                    {(notifications.items.length === 0 && error) && (
                        <div className="flex justify-center py-6">
                            <p className="text-gray-400 italic">
                                {error.status_code === 404
                                    ? 'You don\'t notification.'
                                    : (error?.error?.message || 'Something went wrong :(')
                                }
                            </p>
                        </div>
                    )}
                    {/* --- NOTIF LIST ---- */}
                    {(notifications.items.length !== 0) && (
                        <div>
                            <NotificationList
                                notifications={notifications.items}
                                readNotification={handleReadNotification}
                                toggleNotification={setNotificationOpen}
                                infiniteScrollRef={infiniteRef}
                            />
                            {(notifications.items.length !== 0 && !error && isLoading) && (
                                <div className="flex justify-center py-2">
                                    <Loader />
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
