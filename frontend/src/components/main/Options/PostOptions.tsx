import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface IProps {
    openDeleteModal: () => void;
    openUpdateModal: () => void;
}

const PostOptions: React.FC<IProps> = (props) => {
    const [isOpenOption, setIsOpenOption] = useState(false);

    const toggleOpen = () => {
        setIsOpenOption(!isOpenOption);
    }

    return (
        <div className="relative z-10">
            <div
                className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                onClick={toggleOpen}
            >
                <EllipsisOutlined style={{ fontSize: '20px' }} />
            </div>
            {isOpenOption && (
                <div className="post-option-wrapper w-44 flex flex-col bg-white rounded-md shadow-lg overflow-hidden absolute top-8 right-3">
                    <h4
                        className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer"
                        onClick={props.openUpdateModal}
                    >
                        <EditOutlined className="mr-4" />
                Edit Post
                </h4>
                    <h4
                        className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer"
                        onClick={props.openDeleteModal}
                    >
                        <DeleteOutlined className="mr-4" />
                        Delete Post
                </h4>
                </div>
            )}
        </div>
    );
};

export default PostOptions;
