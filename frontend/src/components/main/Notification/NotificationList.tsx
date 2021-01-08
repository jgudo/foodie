import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useHistory } from 'react-router-dom';
import { INotification } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    notifications: INotification[],
    toggleNotification: (bool: boolean) => void;
    readNotification: (id: string) => void;
}

const NotificationList: React.FC<IProps> = ({ toggleNotification, notifications, readNotification }) => {
    const history = useHistory();
    const handleNotificationClick = (link: string, id: string) => {
        readNotification(id);
        toggleNotification(false);
        history.push(link);
    };

    return (
        <div>
            {notifications.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-400 italic">No new notifications</p>
                </div>
            ) : (
                    <div className="max-h-80vh overflow-y-scroll divide-y divide-gray-100">
                        {notifications.map((notif) => (
                            <div
                                className={`${notif.unread ? 'bg-indigo-100 hover:bg-indigo-200' : 'bg-white'} p-4 hover:bg-gray-100 hover:opacity-95 divide-y divide-y-2 divide-gray-100`}
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif.link, notif.id)}
                            >
                                <div>
                                    <div className="flex flex-wrap items-center">
                                        <div
                                            className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                                            style={{
                                                background: `#f8f8f8 url(${notif.initiator.profilePicture || 'https://i.pravatar.cc/60'}`
                                            }}
                                        />
                                        <span className="text-indigo-700">@{notif.initiator.username}</span>
                                &nbsp;
                                                <span className="text-gray-700">
                                            {
                                                notif.type === 'like' ? 'likes your post.'
                                                    : notif.type === 'comment' ? 'commented on your post.'
                                                        : notif.type === 'follow' ? 'started following you.'
                                                            : ''
                                            }
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm ml-14">{dayjs(notif.createdAt).fromNow()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
};

export default NotificationList;
