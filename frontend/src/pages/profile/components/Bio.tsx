
interface IProps {
    bio: string;
}

const Sidebar: React.FC<IProps> = ({ bio }) => {
    return (
        <aside className="p-4 bg-white shadow-lg rounded-md ">
            <h3 className="mb-2">Bio</h3>
            {
                bio ? (
                    <p className="text-gray-600">{bio}</p>
                ) : (
                        <p className="text-gray-400 italic">No bio set.</p>
                    )
            }

        </aside>
    );
};

export default Sidebar;
