import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { INotification } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    notifications: INotification[]
}

const NotificationList: React.FC<IProps> = ({ notifications }) => {
    return (
        <div>
            <div className="p-4 border-b-gray-200 bg-indigo-700 rounded-t-md">
                <h6 className="text-white">Notifications</h6>
            </div>
            {notifications.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-400 italic">No new notifications</p>
                </div>
            ) : (
                    <div className="max-h-screen overflow-y-scroll">
                        {notifications.map((notif) => (
                            <>
                                <Link to={`${notif.link}`}>
                                    <div
                                        key={notif.id}
                                        className={`${notif.unread ? 'bg-indigo-100' : 'bg-gray-100'} p-4 hover:bg-gray-100`}
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
                                {
                                                    notif.type === 'like' ? 'likes your post.'
                                                        : notif.type === 'comment' ? 'commented on your post.'
                                                            : notif.type === 'follow' ? 'started following you.'
                                                                : ''
                                                }
                                            </div>
                                            <span className="text-gray-500 text-sm ml-14">{dayjs(notif.createdAt).fromNow()}</span>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        ))}
                    </div>
                )}
        </div>
    );
};

export default NotificationList;
