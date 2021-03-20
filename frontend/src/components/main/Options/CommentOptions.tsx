import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTargetComment } from '~/redux/action/helperActions';
import { IComment } from '~/types/types';

interface IProps {
    comment: IComment;
    onClickEdit: () => void;
    openDeleteModal: () => void;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    const handleClickOutside = (e: Event) => {
        const option = (e.target as HTMLDivElement).closest(`#comment_${props.comment.id}`);

        if (!option && isOpenRef.current) {
            setIsOpen(false);
        }
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const onClickDelete = () => {
        dispatch(setTargetComment(props.comment));
        props.openDeleteModal();
    }

    const onClickEdit = () => {
        setIsOpen(false);

        props.onClickEdit();
        dispatch(setTargetComment(props.comment));
    }

    return (
        <div className="relative z-10" id={`comment_${props.comment.id}`}>
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
