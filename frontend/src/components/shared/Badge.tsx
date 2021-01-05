interface IProps {
    children: React.ReactNode,
    count: number;
}

const Badge: React.FC<IProps> = ({ children, count = 0 }) => {
    return (
        <div className="relative">
            {count > 0 && (
                <div className="w-4 h-4 flex items-center justify-center rounded-full absolute -right-2 -top-1 bg-red-700 text-xs text-white">
                    {count}
                </div>
            )}
            {children}
        </div>
    );
};

export default Badge;
