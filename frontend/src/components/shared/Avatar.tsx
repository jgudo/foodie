import placeholder from '~/images/avatar_placeholder.png';

interface IProps {
    url?: string;
    size?: string;
    className?: string;
}

const Avatar: React.FC<IProps> = ({ url, size, className }) => {
    return (
        <div
            className={`
                ${size === 'xs'
                    ? 'w-5 h-5'
                    : size === 'sm'
                        ? 'w-8 h-8'
                        : size === 'lg'
                            ? 'w-12 h-12'
                            : 'w-10 h-10'} !bg-cover !bg-no-repeat border border-gray-100 rounded-full ${className}`}
            style={{ background: `#f8f8f8 url(${url || placeholder})` }}
        />
    )
};

Avatar.defaultProps = {
    size: 'md'
}

export default Avatar;
