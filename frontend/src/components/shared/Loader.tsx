
const Loader: React.FC<{ mode?: string; size?: string }> = ({ mode, size }) => {
    return (
        <div className="flex items-center space-x-2">
            <div
                className={`animate-loader ${mode === 'light' ? 'animate-loder-light' : 'animate-loader-dark'}`}
                style={{
                    width: `${size === 'sm' ? '10px' : '20px'}`,
                    height: `${size === 'sm' ? '10px' : '20px'}`
                }}
            />
            <div
                className={`animate-loader ${mode === 'light' ? 'animate-loder-light' : 'animate-loader-dark'}`}
                style={{
                    width: `${size === 'sm' ? '10px' : '20px'}`,
                    height: `${size === 'sm' ? '10px' : '20px'}`
                }}
            />
            <div
                className={`animate-loader ${mode === 'light' ? 'animate-loder-light' : 'animate-loader-dark'}`}
                style={{
                    width: `${size === 'sm' ? '10px' : '20px'}`,
                    height: `${size === 'sm' ? '10px' : '20px'}`
                }}
            />
        </div>
    );
};

Loader.defaultProps = {
    mode: 'dark',
    size: 'sm'
}

export default Loader;
