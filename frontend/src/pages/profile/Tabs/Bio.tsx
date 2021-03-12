import dayjs from 'dayjs';

interface IProps {
    bio: string;
    dateJoined: string | Date;
}

const Bio: React.FC<IProps> = ({ bio, dateJoined }) => {
    return (
        <aside className="p-4 bg-white dark:bg-indigo-1000 shadow-lg rounded-md space-y-4">
            <div>
                <h4 className="mb-2 dark:text-white">Bio</h4>
                {
                    bio ? (
                        <p className="text-gray-600 dark:text-gray-400">{bio}</p>
                    ) : (
                        <p className="text-gray-400 italic">No bio set.</p>
                    )
                }
            </div>
            <div>
                <h4 className="mb-2 dark:text-white">Joined</h4>
                <p className="text-gray-600 dark:text-gray-400">{dayjs(dateJoined).format('MMM.DD, YYYY')}</p>
            </div>
        </aside>
    );
};

export default Bio;
