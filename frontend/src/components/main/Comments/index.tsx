import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { commentOnPost, getComments } from "~/services/api";
import { IComment, IRootReducer } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    postID: string;
}

const Comments: React.FC<IProps> = ({ postID }) => {
    const [comments, setComments] = useState<any>({
        items: [],
        commentsCount: 0
    });
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useSelector((state: IRootReducer) => state.auth);
    const [commentBody, setCommentBody] = useState('');

    useEffect(() => {
        fetchComment(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchComment = async (limit = 5) => {
        try {
            setIsLoading(true);
            const { comments: fetchedComments, commentsCount } = await getComments(postID, { offset, limit });

            setOffset(offset + 1);
            setComments({ items: [...comments.items, ...fetchedComments], commentsCount });
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
                const comment = await commentOnPost(postID, commentBody);

                setComments({ ...comments, items: [...comments.items, comment] });
                // TODO ----
                setCommentBody('');
            } catch (e) {

            }

        }
    };

    return (
        <>
            <div className="bg-white rounded-b-md">
                {(error !== null && !isLoading && comments.commentsCount !== 0) && (
                    <div className="py-4 px-2 mt-6">
                        {/* ----- COMMENT LIST ---------- */}
                        {comments.items.map((comment: IComment) => (
                            <div
                                className="flex"
                                key={comment.id}
                            >
                                <Link to={`/${comment.author.username}`}>
                                    <div
                                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                                        style={{ background: `#f8f8f8 url(${comment.author.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                                    />
                                </Link>
                                <div className="flex flex-col">
                                    <Link to={`/${comment.author.username}`}>
                                        <h5>{comment.author.username}</h5>
                                    </Link>
                                    <p className="text-gray-800">{comment.body}</p>
                                    <span className="text-xs text-gray-400 mt-2">{dayjs(comment.createdAt).fromNow()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/*  ---- INPUT COMMENT ----- */}
                <div className="flex items-center py-4 px-2 mt-4 ">
                    <div
                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                        style={{ background: `#f8f8f8 url(${user.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    />
                    <input
                        className="flex-grow"
                        type="text"
                        placeholder="Write a comment..."
                        readOnly={isLoading}
                        onChange={handleCommentBodyChange}
                        onKeyDown={handleSubmitComment}
                    />
                </div>
            </div>
        </>
    );
};

export default Comments;
