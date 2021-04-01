import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Boundary, Loader } from '~/components/shared';
import { useDidMount } from '~/hooks';
import { setTargetComment } from '~/redux/action/helperActions';
import { commentOnPost, getComments } from "~/services/api";
import { IComment, IFetchParams } from "~/types/types";
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

const Comments: React.FC<IProps> = (props) => {
    const {
        postID,
        isCommentVisible,
        commentInputRef,
    } = props;
    const [comments, setComments] = useState<IComment[]>([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setUpdateMode] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [commentBody, setCommentBody] = useState('');
    const didMount = useDidMount(true);
    const dispatch = useDispatch();

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
            const result = await getComments(postID, params);

            if (didMount) {
                setOffset(offset + 1);
                setComments([...result.reverse(), ...comments]);
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
                const comment = await commentOnPost(postID, commentBody);

                if (didMount) {
                    setComments([...comments, comment]);

                    setCommentBody('');
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
        dispatch(setTargetComment(null));
        setUpdateMode(false);
    }

    const updateCommentCallback = (comment: IComment) => {
        if (didMount) {
            setComments(oldComments => oldComments.filter((cmt) => cmt.id !== comment.id));
        }
    }

    return !isCommentVisible ? null : (
        <Boundary>
            <div className="rounded-b-md border-t border-gray-200 dark:border-gray-800">
                {/* ---- LOAD MORE COMMENTS BUTTON ----- */}
                {(!error) && (
                    <span
                        className="text-indigo-700 dark:text-indigo-400 text-sm font-bold cursor-pointer inline-block p-2"
                        onClick={() => fetchComment({
                            offset: 1,
                            limit: 10,
                            skip: comments.length === 1 ? 1 : undefined,
                            sort: 'asc'
                        })}
                    >
                        {isLoading ? <div className="ml-8 py-2"><Loader size="sm" /></div> : 'Load more comments'}
                    </span>
                )}
                {/* ----- COMMENT LIST ---------- */}
                <div className="py-4 laptop:px-2 space-y-2 divide-y divide-gray-200 dark:divide-gray-800">
                    <CommentList comments={comments} updateCommentCallback={updateCommentCallback} />
                </div>
                {/*  ---- INPUT COMMENT ----- */}
                {isCommentVisible && (
                    <CommentInput
                        ref={commentInputRef}
                        onChange={handleCommentBodyChange}
                        placeholder="Write a comment..."
                        isSubmitting={isSubmitting}
                        isLoading={isLoading}
                        isUpdateMode={isUpdateMode}
                        onKeyDown={handleSubmitComment}
                        value={commentBody}
                    />
                )}
            </div>
        </Boundary>
    );
};

export default Comments;
