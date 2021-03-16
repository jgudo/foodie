import { DownOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "~/components/shared";
import { useDidMount } from "~/hooks";
import { getCommentReplies, replyOnComment } from "~/services/api";
import { IComment } from "~/types/types";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

dayjs.extend(relativeTime);

interface IProps {
    comment: IComment;
}

const CommentItem: React.FC<IProps> = ({ comment }) => {
    const [offset, setOffset] = useState(0);
    const [replies, setReplies] = useState<IComment[]>([]);
    const [isOpenInput, setOpenInput] = useState(false);
    const [replyBody, setReplyBody] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [isUpdateMode, setUpdateMode] = useState(false);
    const didMount = useDidMount(true);
    const replyInputRef = useRef<HTMLInputElement | null>(null);

    const getReplies = async (comment_id: string) => {
        try {
            const res = await getCommentReplies({ offset, comment_id: comment.id, post_id: comment.post_id });

            setReplies(res.replies);
            setOffset(offset + 1);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmitReply = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && replyBody) {
            try {
                setSubmitting(true);
                const reply = await replyOnComment(replyBody, comment.id, comment.post_id);

                if (didMount) {
                    if (isUpdateMode) {
                    } else {
                        setReplies([...replies, reply]);
                    }

                    setReplyBody('');
                    setUpdateMode(false);
                    setSubmitting(false);
                }
            } catch (e) {
                if (didMount) {
                    setSubmitting(false);
                    // setError(e.error.message);
                }
            }
        } else if (e.key === 'Escape') {
            // if (isUpdateMode) handleCancelUpdate();
            if (replyInputRef.current) replyInputRef.current.blur();
        }

    };

    const onClickReply = () => {
        setOpenInput(!isOpenInput);
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReplyBody(e.target.value);
    };

    return (
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
                    {/* {(comment.isOwnComment || comment.isPostOwner) && (
                        <CommentOptions
                            setCommentBody={setCommentBody}
                            comment={comment}
                            openDeleteModal={deleteModal.openModal}
                            setTargetID={setTargetID}
                            setIsUpdating={setIsUpdating}
                            commentInputRef={commentInputRef}
                            setInputCommentVisible={setInputCommentVisible}
                        />
                    )} */}
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
                        <span
                            className="text-xs text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-200 mt-2 hover:cursor-pointer"
                            onClick={() => getReplies(comment.id)}
                        >
                            View Replies <DownOutlined className="text-1xs" />
                        </span>
                    )}
                    {/* ---- REPLY LIST ------- */}
                    <CommentList comments={replies} />
                    {/* ------ REPLY INPUT ----- */}
                    {isOpenInput && (
                        <CommentInput
                            value={replyBody}
                            placeholder="Write a reply..."
                            onChange={handleOnChange}
                            isSubmitting={isSubmitting}
                            ref={replyInputRef}
                            isUpdateMode={isUpdateMode}
                            onKeyDown={handleSubmitReply}
                        />
                    )}
                </div>
            </div>
        </div>
    )
};

export default CommentItem;
