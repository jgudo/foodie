import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    StarFilled,
    StarOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { BookmarkButton } from '~/components/main';
import { IPost } from '~/types/types';

interface IProps {
    openDeleteModal: () => void;
    openUpdateModal: () => void;
    post: IPost;
}

const PostOptions: React.FC<IProps> = (props) => {
    const [isOpenOption, setIsOpenOption] = useState(false);
    const isOpenOptionRef = useRef(isOpenOption);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        isOpenOptionRef.current = isOpenOption;
    }, [isOpenOption]);

    const handleClickOutside = (e: Event) => {
        const option = (e.target as HTMLDivElement).closest('.post-option-wrapper');

        if (!option && isOpenOptionRef.current) {
            setIsOpenOption(false);
        }
    }

    const toggleOpen = () => {
        setIsOpenOption(!isOpenOption);
    }

    return (
        <div className="post-option-wrapper relative z-10">
            <div
                className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1100"
                onClick={toggleOpen}
            >
                <EllipsisOutlined style={{ fontSize: '20px' }} />
            </div>
            {isOpenOption && (
                <div className="w-60 flex flex-col bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden absolute top-8 right-3 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                    {props.post.isOwnPost ? (
                        <>
                            <h4
                                className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer dark:text-white"
                                onClick={props.openUpdateModal}
                            >
                                <EditOutlined className="mr-4" />
                                Edit Post
                        </h4>
                            <h4
                                className="p-4 flex items-center hover:bg-indigo-700 hover:text-white cursor-pointer dark:text-white"
                                onClick={props.openDeleteModal}
                            >
                                <DeleteOutlined className="mr-4" />
                                Delete Post
                        </h4>
                        </>
                    ) : (
                        <BookmarkButton postID={props.post.id} initBookmarkState={props.post.isBookmarked}>
                            {({ dispatchBookmark, isBookmarked }) => (
                                <h4
                                    className="p-4 flex items-center cursor-pointer dark:text-white"
                                    onClick={dispatchBookmark}
                                >
                                    {isBookmarked ? (
                                        <StarFilled className="text-red-600 text-2xl p-2 flex justify-center items-center rounded-full hover:bg-red-100" />
                                    ) : (
                                        <StarOutlined className="text-red-600 text-2xl p-2 flex justify-center items-center rounded-full hover:bg-red-100" />
                                    )}
                                    <span>{isBookmarked ? 'Unbookmark Post' : 'Bookmark Post'} </span>
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
