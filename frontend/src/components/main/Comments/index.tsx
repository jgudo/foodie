import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Boundary from '~/components/shared/Boundary';
import Loader from '~/components/shared/Loader';
import useModal from '~/hooks/useModal';
import { commentOnPost, getComments, updateComment } from "~/services/api";
import { IComment, IFetchParams, IRootReducer } from "~/types/types";
import DeleteCommentModal from '../Modals/DeleteCommentModal';
import CommentOptions from '../Options/CommentOptions';

dayjs.extend(relativeTime);

interface IProps {
    postID: string;
    authorID: string;
}

interface ICommentsState {
    items: IComment[],
    commentsCount: number;
}

const Comments: React.FC<IProps> = ({ postID, authorID }) => {
    const [comments, setComments] = useState<ICommentsState>({
        items: [],
        commentsCount: 0
    });
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [targetID, setTargetID] = useState('');
    const user = useSelector((state: IRootReducer) => state.auth);
    const [commentBody, setCommentBody] = useState('');
    const commentInputRef = useRef<HTMLInputElement | null>(null);
    const deleteModal = useModal();

    useEffect(() => {
        fetchComment({ offset: 0, limit: 1, sort: 'desc' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchComment = async (params: IFetchParams) => {
        try {
            setIsLoading(true);
            const { comments: fetchedComments, commentsCount } = await getComments(postID, params);
            console.log(comments);
            setOffset(offset + 1);
            setComments({ items: [...fetchedComments.reverse(), ...comments.items], commentsCount });
            setIsLoading(false);
        } catch (e) {
            console.log('CANT GET COMMENTS', e);
            setIsLoading(false);
            setError(e.error.message);
        }
    };

    const handleCommentBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCommentBody(val);
    };

    const handleSubmitComment = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && commentBody) {
            try {
                const comment = isUpdating ? await updateComment(targetID, commentBody) : await commentOnPost(postID, commentBody);

                console.log(isUpdating);
                if (isUpdating) {
                    handleUpdateCommentState(comment);
                } else {
                    setComments({ commentsCount: comments.commentsCount + 1, items: [...comments.items, comment] });
                }

                setCommentBody('');
                setTargetID('');
                setIsUpdating(false);
            } catch (e) {
                setError(e.error.message);
            }
        } else if (e.key === 'Escape') {
            if (isUpdating) handleCancelUpdate();
            if (commentInputRef.current) commentInputRef.current.blur();
        }

    };

    const handleCancelUpdate = () => {
        setCommentBody('');
        setTargetID('');
        setIsUpdating(false);
    }

    const handleUpdateCommentState = (comment: IComment) => {
        const filteredComments = comments.items.map((item) => {
            if (item.id === comment.id) {
                return {
                    ...item,
                    ...comment
                }
            }
            return item;
        });

        setComments({ ...comments, items: filteredComments });
    }

    const deleteSuccessCallback = (commentID: string) => {
        // eslint-disable-next-line array-callback-return
        const filteredComments = comments.items.filter((comment) => comment.id !== commentID);

        setTargetID('');
        setComments({ commentsCount: filteredComments.length, items: (filteredComments as IComment[]) });
    }

    return (
        <Boundary>
            <div className="bg-white rounded-b-md">
                {(!error && comments.items.length !== 0) && (
                    <span
                        className="text-indigo-700 font-bold cursor-pointer inline-block p-2"
                        onClick={() => fetchComment({
                            offset: 1,
                            limit: 10,
                            skip: comments.items.length === 1 ? 1 : undefined,
                            sort: 'asc'
                        })}
                    >
                        {isLoading ? <Loader /> : 'Load more comments'}
                    </span>
                )}
                {(comments.commentsCount !== 0) && (
                    <div className="py-4 px-2 mt-6 space-y-2 divide-y divide-gray-200">
                        {/* ----- COMMENT LIST ---------- */}
                        {comments.items.map((comment: IComment) => (
                            <div
                                className="flex py-2"
                                key={comment.id}
                            >
                                <Link to={`/${comment.author.username}`} className="mr-2">
                                    <div
                                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full"
                                        style={{ background: `#f8f8f8 url(${comment.author.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                                    />
                                </Link>
                                <div className="inline-flex items-start flex-col flex-grow">
                                    <Link to={`/${comment.author.username}`}>
                                        <h5>{comment.author.username}</h5>
                                    </Link>
                                    <p className="text-gray-800 min-w-full break-all">{comment.body}</p>
                                    <span className="text-xs text-gray-400 mt-2">{dayjs(comment.createdAt).fromNow()}</span>
                                </div>
                                {(user.id === comment.author.id || authorID === user.id) && (
                                    <CommentOptions
                                        isOwnComment={user.id === comment.author.id}
                                        setCommentBody={setCommentBody}
                                        comment={comment}
                                        openDeleteModal={deleteModal.openModal}
                                        setTargetID={setTargetID}
                                        setIsUpdating={setIsUpdating}
                                        commentInputRef={commentInputRef}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {/* ---- IS UPDATING HINT ---- */}
                {isUpdating && (
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-xs ml-14 text-gray-400">Updating Comment. Press Esc to cancel</span>
                        <span
                            className="text-xs text-indigo-500 underline p-2 cursor-pointer"
                            onClick={handleCancelUpdate}
                        >
                            Cancel
                        </span>
                    </div>
                )}
                {/*  ---- INPUT COMMENT ----- */}
                <div className={`flex items-center py-4 px-2 ${isUpdating && 'bg-yellow-100'}`}>
                    <div
                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                        style={{ background: `#f8f8f8 url(${user.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    />
                    <input
                        className="flex-grow"
                        type="text"
                        placeholder="Write a comment..."
                        readOnly={isLoading}
                        ref={commentInputRef}
                        onChange={handleCommentBodyChange}
                        onKeyDown={handleSubmitComment}
                        value={commentBody}
                    />
                </div>
            </div>
            <DeleteCommentModal
                isOpen={deleteModal.isOpen}
                openModal={deleteModal.openModal}
                closeModal={deleteModal.closeModal}
                commentID={targetID}
                deleteSuccessCallback={deleteSuccessCallback}
            />
        </Boundary>
    );
};

export default Comments;
