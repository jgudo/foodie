import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTargetCommentID } from '~/redux/action/helperActions';
import { showModal } from '~/redux/action/modalActions';
import { EModalType, IComment } from '~/types/types';

interface IProps {
    comment: IComment;
    onClickEdit: () => void;
}

const CommentOptions: React.FC<IProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(isOpen);
    const dispatch = useDispatch();

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
        dispatch(setTargetCommentID(props.comment.id));
        dispatch(showModal(EModalType.DELETE_COMMENT));
    }

    const onClickEdit = () => {
        setIsOpen(false);

        props.onClickEdit();
        dispatch(setTargetCommentID(props.comment.id));
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
                    {props.comment.isOwnComment && (
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
