import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { IComment } from '~/types/types';

interface IProps {
    isOwnComment: boolean;
    openDeleteModal: () => void;
    setIsUpdating: Dispatch<SetStateAction<boolean>>;
    setCommentBody: Dispatch<SetStateAction<string>>;
    setTargetID: Dispatch<SetStateAction<string>>;
    commentInputRef: RefObject<HTMLInputElement>;
    comment: IComment;
}

// isOwnComment={user.id === comment.author.id}
//                                         commentID={comment.id}

const CommentOptions: React.FC<IProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const onClickDelete = () => {
        props.setTargetID(props.comment.id);
        props.openDeleteModal();
    }

    const onClickEdit = () => {
        if (props.commentInputRef.current) props.commentInputRef.current.focus();
        setIsOpen(false);
        props.setCommentBody(props.comment.body);
        props.setIsUpdating(true);
        props.setTargetID(props.comment.id);
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
                    {props.isOwnComment && (
                        <h4
                            className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer"
                            onClick={onClickEdit}
                        >
                            <EditOutlined className="mr-4" />
                            Edit Comment
                        </h4>
                    )}
                    <h4
                        className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer"
                        onClick={onClickDelete}
                    >
                        <DeleteOutlined className="mr-4" />
                        Delete Comment
                </h4>
                </div>
            )}
        </div>
    );
};

export default CommentOptions;
