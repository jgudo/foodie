import { CommentOutlined, GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DeletePostModal from '~/components/main/Modals/DeletePostModal';
import Avatar from '~/components/shared/Avatar';
import ImageGrid from '~/components/shared/ImageGrid';
import useModal from '~/hooks/useModal';
import { IPost, IRootReducer } from "~/types/types";
import Comments from '../Comments';
import LikeButton from '../LikeButton';
import EditPostModal from '../Modals/EditPostModal';
import PostLikesModal from '../Modals/PostLikesModal';
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
    const likesModal = useModal();
    const commentInputRef = useRef<HTMLInputElement | null>(null);

    const handleToggleComment = () => {
        if (!isCommentVisible) setCommentVisible(true);
        if (commentInputRef.current) commentInputRef.current.focus();
    }

    const displayLikeMetric = (likesCount: number, isLiked: boolean) => {
        const like = likesCount > 1 ? 'like' : 'likes';
        const likeMinusSelf = (likesCount - 1) > 1 ? 'like' : 'likes';
        const people = likesCount > 1 ? 'people' : 'person';
        const peopleMinusSelf = (likesCount - 1) > 1 ? 'people' : 'person';

        if (isLiked && likesCount <= 1) {
            return 'You like this.'
        } else if (isLiked && likesCount > 1) {
            return `You and ${likesCount - 1} ${peopleMinusSelf} ${likeMinusSelf} this.`;
        } else {
            return `${likesCount} ${people} ${like} this.`;
        }
    }

    return (
        <div className="flex flex-col bg-white rounded-lg my-4 p-4 first:mt-0 shadow-lg">
            {/* --- AVATAR AND OPTIONS */}
            <div className="flex justify-between items-center w-full">
                <div className="flex">

                    <Avatar
                        url={post.author.profilePicture}
                        className="mr-3"
                    />
                    <div className="flex flex-col">
                        <Link to={`/user/${post.author.username}`}>
                            <h5 className="font-bold">{post.author.username}</h5>
                        </Link>
                        <div className="flex space-x-1">
                            {post.privacy === 'private'
                                ? <LockOutlined className="flex items-center justify-center text-gray-400" />
                                : post.privacy === 'friends'
                                    ? <UserOutlined className="flex items-center justify-center text-gray-400" />
                                    : <GlobalOutlined className="flex items-center justify-center text-gray-400" />
                            }
                            <span className="text-sm text-gray-500">{dayjs(post.createdAt).fromNow()}</span>
                        </div>
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
            {/* --- IMAGE GRID ----- */}
            {post.photos.length !== 0 && <ImageGrid images={post.photos} />}
            {/* ---- LIKES/COMMENTS DETAILS ---- */}
            <div className="flex justify-between px-2 my-2">
                <div onClick={likesModal.openModal}>
                    {post.likesCount > 0 && (
                        <span className="text-gray-700 text-sm cursor-pointer hover:underline">
                            {displayLikeMetric(post.likesCount, post.isLiked)}
                        </span>
                    )}
                </div>
                {/* --- COMMENTS COUNT ----- */}
                <div>
                    {post.commentsCount > 0 && (
                        <span
                            className="text-gray-700 cursor-pointer text-sm hover:underline"
                            onClick={handleToggleComment}
                        >
                            {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                        </span>
                    )}
                </div>
            </div>
            {/* --- LIKE/COMMENT BUTTON */}
            <div className="flex items-center justify-around py-2 border-t border-gray-200">
                <LikeButton postID={post.id} isLiked={post.isLiked} likeCallback={likeCallback} />
                <span
                    className="py-2 rounded-md flex items-center justify-center text-gray-700 hover:text-gray-800 cursor-pointer hover:bg-gray-100 text-l w-2/4"
                    onClick={handleToggleComment}
                >
                    <CommentOutlined />&nbsp;Comment
                    </span>
            </div>
            <Comments
                postID={post.id}
                authorID={post.author.id}
                isCommentVisible={isCommentVisible}
                commentInputRef={commentInputRef}
                setInputCommentVisible={setCommentVisible}
            />
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
            <PostLikesModal
                isOpen={likesModal.isOpen}
                openModal={likesModal.openModal}
                closeModal={likesModal.closeModal}
                postID={post.id}
            />
        </div>
    );
};

export default PostItem;
