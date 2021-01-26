import dayjs from 'dayjs';

interface IProps {
    bio: string;
    dateJoined: string | Date;
}

const Sidebar: React.FC<IProps> = ({ bio, dateJoined }) => {
    return (
        <aside className="p-4 bg-white shadow-lg rounded-md space-y-4">
            <div>
                <h4 className="mb-2">Bio</h4>
                {
                    bio ? (
                        <p className="text-gray-600">{bio}</p>
                    ) : (
                            <p className="text-gray-400 italic">No bio set.</p>
                        )
                }
            </div>
            <div>
                <h4 className="mb-2">Joined</h4>
                <p className="text-gray-600">{dayjs(dateJoined).format('MMM.DD, YYYY')}</p>
            </div>
        </aside>
    );
};

export default Sidebar;
