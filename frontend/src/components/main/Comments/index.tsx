import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DeleteCommentModal } from '~/components/main';
import { Boundary, Loader } from '~/components/shared';
import { useDidMount, useModal } from '~/hooks';
import { commentOnPost, getComments, updateComment } from "~/services/api";
import { IComment, IFetchParams, IRootReducer } from "~/types/types";
import CommentInput from './CommentInput';
import CommentList from './CommentList';

dayjs.extend(relativeTime);

interface IProps {
    postID: string;
    authorID: string;
    isCommentVisible: boolean;
    commentInputRef: React.RefObject<HTMLInputElement>;
    setInputCommentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICommentsState {
    items: IComment[],
    commentsCount: number;
}

const Comments: React.FC<IProps> = (props) => {
    const {
        postID,
        authorID,
        isCommentVisible,
        commentInputRef,
        setInputCommentVisible
    } = props;
    const [comments, setComments] = useState<ICommentsState>({
        items: [],
        commentsCount: 0
    });
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setUpdateMode] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [targetID, setTargetID] = useState('');
    const user = useSelector((state: IRootReducer) => state.auth);
    const [commentBody, setCommentBody] = useState('');
    const deleteModal = useModal();
    const didMount = useDidMount(true);

    useEffect(() => {
        fetchComment({ offset: 0, limit: 1, sort: 'desc' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (commentInputRef.current) commentInputRef.current.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCommentVisible]);

    const fetchComment = async (params: IFetchParams) => {
        try {
            setIsLoading(true);
            const { comments: fetchedComments, commentsCount } = await getComments(postID, params);

            if (didMount) {
                setOffset(offset + 1);
                setComments({ items: [...fetchedComments.reverse(), ...comments.items], commentsCount });
                setIsLoading(false);
            }
        } catch (e) {
            if (didMount) {
                setIsLoading(false);
                setError(e.error?.message || 'Something went wrong.');
            }
        }
    };

    const handleCommentBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentBody(e.target.value);
    };

    const handleSubmitComment = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && commentBody) {
            try {
                setSubmitting(true);
                const comment = isUpdateMode ? await updateComment(targetID, commentBody) : await commentOnPost(postID, commentBody);

                if (didMount) {
                    if (isUpdateMode) {
                        handleUpdateCommentState(comment);
                    } else {
                        setComments({ commentsCount: comments.commentsCount + 1, items: [...comments.items, comment] });
                    }

                    setCommentBody('');
                    setTargetID('');
                    setUpdateMode(false);
                    setSubmitting(false);
                }
            } catch (e) {
                if (didMount) {
                    setSubmitting(false);
                    setError(e.error.message);
                }
            }
        } else if (e.key === 'Escape') {
            if (isUpdateMode) handleCancelUpdate();
            if (commentInputRef.current) commentInputRef.current.blur();
        }

    };

    const handleCancelUpdate = () => {
        setCommentBody('');
        setTargetID('');
        setUpdateMode(false);
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

        if (didMount) {
            setTargetID('');
            setComments({ commentsCount: filteredComments.length, items: (filteredComments as IComment[]) });
        }
    }

    return !isCommentVisible ? null : (
        <Boundary>
            <div className="rounded-b-md border-t border-gray-200 dark:border-gray-800">
                {(!error && comments.items.length !== 10) && (
                    <span
                        className="text-indigo-700 dark:text-indigo-400 text-sm font-bold cursor-pointer inline-block p-2"
                        onClick={() => fetchComment({
                            offset: 1,
                            limit: 10,
                            skip: comments.items.length === 1 ? 1 : undefined,
                            sort: 'asc'
                        })}
                    >
                        {isLoading ? <div className="ml-8 py-2"><Loader size="sm" /></div> : 'Load more comments'}
                    </span>
                )}
                <div className="py-4 px-2 space-y-2 divide-y divide-gray-200 dark:divide-gray-800">
                    {/* ----- COMMENT LIST ---------- */}
                    <CommentList comments={comments.items} />
                </div>
                {/* ---- IS UPDATING HINT ---- */}
                {isUpdateMode && (
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-xs ml-14 text-gray-400">Updating Comment. Press Esc to cancel</span>
                        <span
                            className="text-xs text-indigo-500 dark:text-indigo-400 underline p-2 cursor-pointer"
                            onClick={handleCancelUpdate}
                        >
                            Cancel
                        </span>
                    </div>
                )}
                {/*  ---- INPUT COMMENT ----- */}
                {isCommentVisible && (
                    <CommentInput
                        ref={commentInputRef}
                        onChange={handleCommentBodyChange}
                        placeholder="Write a comment..."
                        isSubmitting={isSubmitting}
                        isLoading={isLoading}
                        isUpdateMode={isUpdateMode}
                        userPicture={user.profilePicture}
                        onKeyDown={handleSubmitComment}
                        value={commentBody}
                    />
                )}
            </div>
            {deleteModal.isOpen && (
                <DeleteCommentModal
                    isOpen={deleteModal.isOpen}
                    openModal={deleteModal.openModal}
                    closeModal={deleteModal.closeModal}
                    commentID={targetID}
                    deleteSuccessCallback={deleteSuccessCallback}
                />
            )}
        </Boundary>
    );
};

export default Comments;
