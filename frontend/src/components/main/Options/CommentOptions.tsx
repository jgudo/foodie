import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { IComment } from '~/types/types';

interface IProps {
    isOwnComment: boolean;
    openDeleteModal: () => void;
    setIsUpdating: Dispatch<SetStateAction<boolean>>;
    setCommentBody: Dispatch<SetStateAction<string>>;
    setTargetID: Dispatch<SetStateAction<string>>;
    setInputCommentVisible: Dispatch<SetStateAction<boolean>>;
    commentInputRef: RefObject<HTMLInputElement>;
    comment: IComment;
}

// isOwnComment={user.id === comment.author.id}
//                                         commentID={comment.id}

const CommentOptions: React.FC<IProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(isOpen);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    const handleClickOutside = (e: Event) => {
        const option = (e.target as HTMLDivElement).closest('.comment-option-wrapper');

        if (!option && isOpenRef.current) {
            setIsOpen(false);
        }
    }

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
        props.setInputCommentVisible(true);
        props.setCommentBody(props.comment.body);
        props.setIsUpdating(true);
        props.setTargetID(props.comment.id);
    }

    return (
        <div className="comment-option-wrapper relative z-10">
            <div
                className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1100"
                onClick={toggleOpen}
            >
                <EllipsisOutlined style={{ fontSize: '20px' }} />
            </div>
            {isOpen && (
                <div className=" w-56 flex flex-col bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden absolute top-8 right-3 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                    {props.isOwnComment && (
                        <h4
                            className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer dark:text-white"
                            onClick={onClickEdit}
                        >
                            <EditOutlined className="mr-4" />
                            Edit Comment
                        </h4>
                    )}
                    <h4
                        className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer dark:text-white"
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
