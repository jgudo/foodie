import { CommentOutlined, GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import withAuth from '~/components/hoc/withAuth';
import {
    Comments,
    DeletePostModal, EditPostModal, LikeButton,
    PostLikesModal, PostOptions
} from '~/components/main';
import { Avatar, ImageGrid } from '~/components/shared';
import { LOGIN } from '~/constants/routes';
import { useModal } from '~/hooks';
import { IPost } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    post: IPost,
    likeCallback: (post: IPost) => void;
    updateSuccessCallback: (post: IPost) => void;
    deleteSuccessCallback: (postID: string) => void;
    isAuth: boolean;
}

const PostItem: React.FC<IProps> = (props) => {
    const { post, likeCallback, updateSuccessCallback, deleteSuccessCallback, isAuth } = props;
    const [isCommentVisible, setCommentVisible] = useState(false);
    const deleteModal = useModal();
    const updateModal = useModal();
    const likesModal = useModal();
    const commentInputRef = useRef<HTMLInputElement | null>(null);

    const handleToggleComment = () => {
        if (!isAuth) return;
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
            return `You and ${likesCount - 1} other ${peopleMinusSelf} ${likeMinusSelf} this.`;
        } else {
            return `${likesCount} ${people} ${like} this.`;
        }
    }

    return (
        <div className="flex flex-col bg-white rounded-lg my-4 p-4 first:mt-0 shadow-lg dark:bg-indigo-1000">
            {/* --- AVATAR AND OPTIONS */}
            <div className="flex justify-between items-center w-full">
                <div className="flex">
                    <Avatar
                        url={post.author.profilePicture?.url}
                        className="mr-3"
                    />
                    <div className="flex flex-col">
                        <Link className="dark:text-indigo-400" to={`/user/${post.author.username}`}>
                            <h5 className="font-bold">{post.author.username}</h5>
                        </Link>
                        <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500">{dayjs(post.createdAt).fromNow()}</span>
                            <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center ${post.isOwnPost && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-indigo-900'}`}
                                onClick={() => post.isOwnPost && updateModal.openModal()}
                                title={post.isOwnPost ? 'Change Privacy' : ''}
                            >
                                {post.privacy === 'private'
                                    ? <LockOutlined className="text-xs text-gray-500 dark:text-white" />
                                    : post.privacy === 'follower'
                                        ? <UserOutlined className="text-xs text-gray-500 dark:text-white" />
                                        : <GlobalOutlined className="text-xs text-gray-500 dark:text-white" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {isAuth && (
                    <PostOptions
                        openDeleteModal={deleteModal.openModal}
                        openUpdateModal={updateModal.openModal}
                        post={post}
                    />
                )}
            </div>
            {/* --- DESCRIPTION */}
            <div className="mb-3 mt-2">
                <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
            </div>
            {/* --- IMAGE GRID ----- */}
            {post.photos.length !== 0 && <ImageGrid images={post.photos.map(img => img.url)} />}
            {/* ---- LIKES/COMMENTS DETAILS ---- */}
            <div className="flex justify-between px-2 my-2">
                <div onClick={() => isAuth && likesModal.openModal()}>
                    {post.likesCount > 0 && (
                        <span className="text-gray-700 text-sm cursor-pointer hover:underline dark:text-gray-500 dark:hover:text-white">
                            {displayLikeMetric(post.likesCount, post.isLiked)}
                        </span>
                    )}
                </div>
                {/* --- COMMENTS COUNT ----- */}
                <div>
                    {post.commentsCount > 0 && (
                        <span
                            className="text-gray-700 cursor-pointer text-sm hover:underline dark:text-gray-500 dark:hover:text-white"
                            onClick={handleToggleComment}
                        >
                            {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                        </span>
                    )}
                </div>
            </div>
            {/* --- LIKE/COMMENT BUTTON */}
            {isAuth ? (
                <div className="flex items-center justify-around py-2 border-t border-gray-200 dark:border-gray-800">
                    <LikeButton postID={post.id} isLiked={post.isLiked} likeCallback={likeCallback} />
                    <span
                        className="py-2 rounded-md flex items-center justify-center text-gray-700 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white dark:hover:bg-indigo-1100 cursor-pointer hover:bg-gray-100 text-l w-2/4"
                        onClick={handleToggleComment}
                    >
                        <CommentOutlined />&nbsp;Comment
                        </span>
                </div>
            ) : (
                <div className="text-center py-2">
                    <span className="text-gray-400 text-sm">
                        <Link className="font-medium underline dark:text-indigo-400" to={LOGIN}>Login</Link> to like or comment on post.
                        </span>
                </div>
            )}
            {isAuth && (
                <>
                    <Comments
                        postID={post.id}
                        authorID={post.author.id}
                        isCommentVisible={isCommentVisible}
                        commentInputRef={commentInputRef}
                        setInputCommentVisible={setCommentVisible}
                    />
                    {deleteModal.isOpen && (
                        <DeletePostModal
                            isOpen={deleteModal.isOpen}
                            openModal={deleteModal.openModal}
                            closeModal={deleteModal.closeModal}
                            postID={post.id}
                            deleteSuccessCallback={deleteSuccessCallback}
                        />
                    )}
                    {updateModal.isOpen && (
                        <EditPostModal
                            isOpen={updateModal.isOpen}
                            openModal={updateModal.openModal}
                            closeModal={updateModal.closeModal}
                            post={post}
                            updateSuccessCallback={updateSuccessCallback}
                        />
                    )}
                    {likesModal.isOpen && (
                        <PostLikesModal
                            isOpen={likesModal.isOpen}
                            openModal={likesModal.openModal}
                            closeModal={likesModal.closeModal}
                            postID={post.id}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default withAuth(PostItem);
