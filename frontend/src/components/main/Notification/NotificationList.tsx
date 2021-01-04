import { INotification } from "~/types/types";

interface IProps {
    notifications: INotification[]
}

const NotificationList: React.FC<IProps> = ({ notifications }) => {
    return (
        <div className="p-4">
            <h6>Notifications</h6>
            {notifications.map((notif) => (
                <div key={notif.id}>
                    <h5>{notif.initiator.username}</h5>
                </div>
            ))}
        </div>
    );
};

export default NotificationList;
