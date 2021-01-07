import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';

const CommentOptions: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="relative z-10">
            <div
                className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                onClick={toggleOpen}
            >
                <EllipsisOutlined style={{ fontSize: '20px' }} />
            </div>
            {isOpen && (
                <div className="post-option-wrapper w-56 flex flex-col bg-white rounded-md shadow-lg overflow-hidden absolute top-8 right-3">
                    <h4 className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer">
                        <EditOutlined className="mr-4" />
                Edit Comment
                </h4>
                    <h4 className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer">
                        <DeleteOutlined className="mr-4" />
                    Delete Comment
                </h4>
                </div>
            )}
        </div>
    );
};

export default CommentOptions;
