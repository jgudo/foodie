import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    LoadingOutlined,
    StarFilled,
    StarOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BookmarkButton } from '~/components/main';
import { setTargetPost } from '~/redux/action/helperActions';
import { showModal } from '~/redux/action/modalActions';
import { EModalType, IPost } from '~/types/types';

interface IProps {
    openDeleteModal: () => void;
    openUpdateModal: () => void;
    post: IPost;
}

const PostOptions: React.FC<IProps> = (props) => {
    const [isOpenOption, setIsOpenOption] = useState(false);
    const isOpenOptionRef = useRef(isOpenOption);
    const dispatch = useDispatch();

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        isOpenOptionRef.current = isOpenOption;
    }, [isOpenOption]);

    const handleClickOutside = (e: Event) => {
        const option = (e.target as HTMLDivElement).closest(`#post_${props.post.id}`);

        if (!option && isOpenOptionRef.current) {
            setIsOpenOption(false);
        }
    }

    const handleClickDelete = () => {
        dispatch(showModal(EModalType.DELETE_POST));
        dispatch(setTargetPost(props.post));
    }

    const handleClickEdit = () => {
        dispatch(showModal(EModalType.EDIT_POST));
        dispatch(setTargetPost(props.post));
    }

    return (
        <div className="relative z-10" id={`post_${props.post.id}`}>
            <div
                className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1100"
                onClick={() => setIsOpenOption(!isOpenOption)}
            >
                <EllipsisOutlined style={{ fontSize: '20px' }} />
            </div>
            {isOpenOption && (
                <div className="w-60 flex flex-col bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden absolute top-8 right-3 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                    {props.post.isOwnPost ? (
                        <>
                            <h4
                                className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer dark:text-white"
                                onClick={handleClickEdit}
                            >
                                <EditOutlined className="mr-4" />
                                Edit Post
                            </h4>
                            <h4
                                className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer dark:text-white"
                                onClick={handleClickDelete}
                            >
                                <DeleteOutlined className="mr-4" />
                                Delete Post
                            </h4>
                        </>
                    ) : (
                        <BookmarkButton postID={props.post.id} initBookmarkState={props.post.isBookmarked}>
                            {({ dispatchBookmark, isBookmarked, isLoading }) => (
                                <h4
                                    className="group p-4 flex items-center cursor-pointer dark:text-white hover:bg-indigo-500 hover:text-white"
                                    onClick={dispatchBookmark}
                                >
                                    {isLoading
                                        ? <LoadingOutlined className="text-gray-600 text-2xl p-2 dark:text-white group-hover:text-white" />
                                        : isBookmarked ? (
                                            <StarFilled className="text-red-600 group-hover:text-white text-2xl p-2 flex justify-center items-center rounded-full" />
                                        ) : (
                                            <StarOutlined className="text-red-600 group-hover:text-white text-2xl p-2 flex justify-center items-center rounded-full" />
                                        )}
                                    <span className={`${isLoading && 'opacity-50'}`}>{isBookmarked ? 'Unbookmark Post' : 'Bookmark Post'} </span>
                                </h4>
                            )}
                        </BookmarkButton>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostOptions;
