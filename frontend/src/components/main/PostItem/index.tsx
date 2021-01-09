import { CommentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DeletePostModal from '~/components/main/Modals/DeletePostModal';
import useModal from '~/hooks/useModal';
import { IPost, IRootReducer } from "~/types/types";
import Comments from '../Comments';
import LikeButton from '../LikeButton';
import EditPostModal from '../Modals/EditPostModal';
import PostOptions from '../Options/PostOptions';

dayjs.extend(relativeTime);

interface IProps {
    post: IPost,
    likeCallback: (post: IPost) => void;
    updateSuccessCallback: (post: IPost) => void;
    deleteSuccessCallback: (postID: string) => void;
}

const PostItem: React.FC<IProps> = ({ post, likeCallback, updateSuccessCallback, deleteSuccessCallback }) => {
    const userID = useSelector((state: IRootReducer) => state.auth.id);
    const [isCommentVisible, setCommentVisible] = useState(false);
    const deleteModal = useModal();
    const updateModal = useModal();

    const handleToggleComment = () => {
        if (!isCommentVisible) {
            setCommentVisible(true);
        }
    }

    return (
        <div className="flex flex-col bg-white rounded-lg my-4 p-4 first:mt-0 shadow-lg">
            {/* --- AVATAR AND OPTIONS */}
            <div className="flex justify-between items-center w-full">
                <div className="flex">

                    <div className="rounded-full overflow-hidden relative w-10 h-10 mr-3 bg-gray-200">
                        <img
                            alt=""
                            className="w-full h-full object-cover"
                            src={post.author.profilePicture || `https://i.pravatar.cc/60?${new Date().getTime()}`}
                        // src={post.author.profilePicture || 'https://source.unsplash.com/200x200/?person'}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Link to={`/${post.author.username}`}>
                            <h5 className="font-bold">{post.author.username}</h5>
                        </Link>
                        <span className="text-sm text-gray-500">{dayjs(post.createdAt).fromNow()}</span>
                    </div>
                </div>
                <PostOptions
                    openDeleteModal={deleteModal.openModal}
                    openUpdateModal={updateModal.openModal}
                    post={post}
                    isOwnPost={userID === post.author.id}
                />
            </div>
            {/* --- DESCRIPTION */}
            <div className="mb-3 mt-2">
                <p className="text-gray-700">{post.description}</p>
            </div>
            {/* --- IMAGE ----- */}
            <Link to={`/post/${post.id}`}>
                <div

                    className="w-full h-25rem !bg-cover !bg-no-repeat !bg-center"
                    style={{
                        background: `#f7f7f7 url(https://source.unsplash.com/500x400/?food?${new Date().getTime()})`
                    }}
                />
            </Link>
            {/* ---- LIKES/COMMENTS DETAILS ---- */}
            <div className="flex justify-between px-2 my-2">
                <div>
                    {post.likesCount > 0 && (
                        <span className="text-gray-700">
                            {post.isLiked && post.likesCount <= 1
                                ? 'You like this.'
                                : post.isLiked && post.likesCount > 1
                                    ? `You and ${post.likesCount - 1} people like this.`
                                    : `${post.likesCount} ${post.likesCount <= 1 ? 'person likes' : 'people like'} this.`
                            }
                        </span>
                    )}
                </div>
                <div>
                    {post.commentsCount > 0 && (
                        <span className="text-gray-700">{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
                    )}
                </div>
            </div>
            {/* --- LIKE/COMMENT BUTTON */}
            <div className="flex items-center justify-around py-2 border-b border-gray-200">
                <LikeButton postID={post.id} isLiked={post.isLiked} likeCallback={likeCallback} />
                <span className="py-2 rounded-md flex items-center justify-center text-gray-700 hover:text-gray-800 cursor-pointer hover:bg-gray-100 text-l w-2/4">
                    <CommentOutlined />&nbsp;Comment
                    </span>
            </div>
            {isCommentVisible && <Comments postID={post.id} authorID={post.author.id} />}
            <DeletePostModal
                isOpen={deleteModal.isOpen}
                openModal={deleteModal.openModal}
                closeModal={deleteModal.closeModal}
                postID={post.id}
                deleteSuccessCallback={deleteSuccessCallback}
            />
            <EditPostModal
                isOpen={updateModal.isOpen}
                openModal={updateModal.openModal}
                closeModal={updateModal.closeModal}
                post={post}
                updateSuccessCallback={updateSuccessCallback}
            />
        </div>
    );
};

export default PostItem;
