import { RedoOutlined } from '@ant-design/icons';

const Loader: React.FC<{ mode?: string; size?: string }> = ({ mode, size }) => {
    return (
        <RedoOutlined
            className={`${mode === 'light' && '!text-white'}text-gray-800 ${size} inline-flex justify-center items-center animate-spin origin-center`}
        />
    );
};

Loader.defaultProps = {
    mode: 'dark',
    size: 'text-xl'
}

export default Loader;
