import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    StarFilled,
    StarOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { IPost } from '~/types/types';
import BookmarkButton from '../BookmarkButton';

interface IProps {
    openDeleteModal: () => void;
    openUpdateModal: () => void;
    post: IPost;
    isOwnPost: boolean;
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
                <div className="post-option-wrapper w-60 flex flex-col bg-white rounded-md shadow-lg overflow-hidden absolute top-8 right-3">
                    {props.isOwnPost ? (
                        <>
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
                        </>
                    ) : (
                            <BookmarkButton postID={props.post.id} initBookmarkState={props.post.isBookmarked}>
                                {({ dispatchBookmark, isBookmarked }) => (
                                    <h4
                                        className="p-4 flex items-center cursor-pointer"
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
