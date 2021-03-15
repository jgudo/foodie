import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CommentOptions, DeleteCommentModal } from '~/components/main';
import { Avatar, Boundary, Loader } from '~/components/shared';
import { useDidMount, useModal } from '~/hooks';
import { commentOnPost, getComments, updateComment } from "~/services/api";
import { IComment, IFetchParams, IRootReducer } from "~/types/types";

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
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
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
        const val = e.target.value;
        setCommentBody(val);
    };

    const handleSubmitComment = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && commentBody) {
            try {
                setIsCommenting(true);
                const comment = isUpdating ? await updateComment(targetID, commentBody) : await commentOnPost(postID, commentBody);

                if (didMount) {
                    if (isUpdating) {
                        handleUpdateCommentState(comment);
                    } else {
                        setComments({ commentsCount: comments.commentsCount + 1, items: [...comments.items, comment] });
                    }

                    setCommentBody('');
                    setTargetID('');
                    setIsUpdating(false);
                    setIsCommenting(false);
                }
            } catch (e) {
                if (didMount) {
                    setIsCommenting(false);
                    setError(e.error.message);
                }
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
                    <TransitionGroup component={null}>
                        {comments.items.map((comment: IComment) => (
                            <CSSTransition
                                timeout={500}
                                classNames="fade"
                                key={comment.id}
                            >
                                <div
                                    className="flex py-2 items-start"
                                    key={comment.id}
                                >
                                    <Link to={`/user/${comment.author.username}`} className="mr-2">
                                        <Avatar url={comment.author.profilePicture?.url} />
                                    </Link>
                                    <div className="inline-flex items-start flex-col w-full laptop:w-auto">
                                        <div className="flex items-start">
                                            {/* ------ USERNAME AND COMMENT TEXT ----- */}
                                            <div className="bg-gray-100 dark:bg-indigo-950 px-2 py-1 rounded-md">
                                                <Link to={`/user/${comment.author.username}`}>
                                                    <h5 className="dark:text-indigo-400">{comment.author.username}</h5>
                                                </Link>
                                                <p className="text-gray-800 text-sm min-w-full break-all dark:text-gray-200">
                                                    {comment.body}
                                                </p>
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
                                                    setInputCommentVisible={setInputCommentVisible}
                                                />
                                            )}
                                        </div>
                                        {/* ---- DATE AND LIKE BUTTON ----- */}
                                        <div className="mt-1">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {dayjs(comment.createdAt).fromNow()}
                                            </span>
                                            {comment.isEdited && (
                                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                                                    Edited
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
                {/* ---- IS UPDATING HINT ---- */}
                {isUpdating && (
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
                    <div className={`flex items-center py-4 px-2 ${isUpdating && 'bg-yellow-100 dark:bg-indigo-1100 rounded-2xl'}`}>
                        <Avatar url={user.profilePicture?.url} className="mr-2" />
                        <div className="flex-grow">
                            <input
                                className={`${isCommenting && 'opacity-50'} dark:bg-indigo-1100 dark:!border-gray-800 dark:text-white`}
                                type="text"
                                placeholder="Write a comment..."
                                readOnly={isLoading || isCommenting}
                                ref={commentInputRef}
                                onChange={handleCommentBodyChange}
                                onKeyDown={handleSubmitComment}
                                value={commentBody}
                            />
                        </div>
                    </div>
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
