import { DownOutlined, LoadingOutlined, UpOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "~/components/shared";
import { useDidMount } from "~/hooks";
import { getCommentReplies, replyOnComment, updateComment } from "~/services/api";
import { IComment, IError } from "~/types/types";
import { CommentOptions } from "../Options";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

dayjs.extend(relativeTime);

interface IProps {
    comment: IComment;
    openDeleteModal: () => void;
}

const CommentItem: React.FC<IProps> = (props) => {
    const [offset, setOffset] = useState(0);
    const [comment, setComment] = useState<IComment>(props.comment || {});
    const [replies, setReplies] = useState<IComment[]>([]);
    const [isOpenInput, setOpenInput] = useState(false);
    const [isVisibleReplies, setVisibleReplies] = useState(true);
    const [editCommentBody, setEditCommentBody] = useState(comment.body || '');
    const [newCommentBody, setNewCommentBody] = useState('');
    const [isGettingReplies, setGettingReplies] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [isUpdateMode, setUpdateMode] = useState(false);
    const [error, setError] = useState<IError | null>(null);
    const didMount = useDidMount(true);
    const replyInputRef = useRef<HTMLInputElement | null>(null);
    const editCommentInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setComment(props.comment);
    }, [props.comment]);

    const getReplies = async () => {
        try {
            setGettingReplies(true);
            const res = await getCommentReplies({ offset, comment_id: comment.id, post_id: comment.post_id });

            setGettingReplies(false);
            setError(null);
            setReplies(res.replies);
            setOffset(offset + 1);
            setVisibleReplies(true);
        } catch (e) {
            console.log(e);
            setGettingReplies(false);
            setError(e);
        }
    }

    const onClickViewReplies = () => {
        if (isGettingReplies) return;
        setVisibleReplies(!isVisibleReplies);

        if (replies.length === 0) getReplies();
    }

    const handleSubmitReply = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                let data;
                setSubmitting(true);

                if (isUpdateMode && editCommentBody) {
                    data = await updateComment(comment.id, editCommentBody);
                } else {
                    data = await replyOnComment(newCommentBody, comment.id, comment.post_id);
                }

                if (didMount) {
                    if (isUpdateMode) {
                        setComment(data);
                        setEditCommentBody('');
                        setUpdateMode(false);
                    } else {
                        setReplies([...replies, data]);
                        setNewCommentBody('');
                        setOpenInput(false);
                    }

                    setSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                if (didMount) {
                    setSubmitting(false);
                    // setError(e.error.message);
                }
            }
        } else if (e.key === 'Escape') {
            // if (isUpdateMode) handleCancelUpdate();
            setUpdateMode(false);
            editCommentInputRef.current && editCommentInputRef.current.blur();
        }

    };

    const onClickReply = () => {
        setOpenInput(!isOpenInput);
        setUpdateMode(false);
    };

    const handleOnEditReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditCommentBody(e.target.value);
    };

    const handleOnNewReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCommentBody(e.target.value);
    };

    const onClickEdit = () => {
        editCommentInputRef.current && editCommentInputRef.current.focus();
        // props.setInputCommentVisible(true);
        setUpdateMode(true);
        setOpenInput(false);
    }

    return (
        <div
            className="flex py-2 items-start"
            key={comment.id}
        >
            <Link to={`/user/${comment.author.username}`} className="mr-2">
                <Avatar url={comment.author.profilePicture?.url} size="sm" />
            </Link>
            <div className="inline-flex items-start flex-col w-full laptop:w-auto">
                {isUpdateMode ? (
                    <CommentInput
                        value={editCommentBody}
                        placeholder="Write a reply..."
                        onChange={handleOnEditReplyChange}
                        isSubmitting={isSubmitting}
                        ref={editCommentInputRef}
                        isUpdateMode={isUpdateMode}
                        onKeyDown={handleSubmitReply}
                    />
                ) : (
                    <>
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
                            {(comment.isOwnComment || comment.isPostOwner) && (
                                <CommentOptions
                                    comment={comment}
                                    onClickEdit={onClickEdit}
                                    openDeleteModal={props.openDeleteModal}
                                />
                            )}
                        </div>
                        <div className="mx-2">
                            {/* ---- DATE AND LIKE BUTTON ----- */}
                            <div className="mt-1 flex items-center space-x-2">
                                {/* ---- LIKE BUTTON ---- */}
                                <span className="text-gray-400 hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 text-xs">
                                    Like
                            </span>
                                {/* ---- REPLY BUTTON */}
                                {comment.depth < 3 && (
                                    <span
                                        className="text-gray-400 hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 text-xs"
                                        onClick={onClickReply}
                                    >
                                        Reply
                                    </span>
                                )}
                                {/* ---- DATE ---- */}
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {dayjs(comment.createdAt).fromNow()}
                                </span>
                                {comment.isEdited && (
                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                                        Edited
                                    </span>
                                )}
                            </div>
                            {/* ---- VIEW MORE BUTTON ----  */}
                            {comment.replyCount > 0 && (
                                <div className="flex space-x-2">
                                    <span
                                        className="text-xs text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-200 mt-2 hover:cursor-pointer"
                                        onClick={onClickViewReplies}
                                    >
                                        {(isVisibleReplies && replies.length !== 0) ? 'Hide Replies' : 'View Replies'}
                                        &nbsp;
                                        {isGettingReplies
                                            ? <LoadingOutlined className="text-1xs" />
                                            : (isVisibleReplies && replies.length !== 0) ? <UpOutlined className="text-1xs" />
                                                : <DownOutlined className="text-1xs" />
                                        }
                                    </span>
                                    {error && error?.status_code !== 404 && (
                                        <span className="text-gray-400 text-xs">{error?.error?.message}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
                {/* ------ REPLY INPUT ----- */}
                {isOpenInput && !isUpdateMode && (
                    <div className="py-4">
                        <CommentInput
                            value={newCommentBody}
                            placeholder="Write a reply..."
                            onChange={handleOnNewReplyChange}
                            isSubmitting={isSubmitting}
                            ref={replyInputRef}
                            isUpdateMode={isUpdateMode}
                            onKeyDown={handleSubmitReply}
                        />
                    </div>
                )}
                {/* ---- REPLY LIST ------- */}
                {replies.length > 0 && isVisibleReplies && <CommentList comments={replies} />}
            </div>
        </div>
    )
};

export default CommentItem;
