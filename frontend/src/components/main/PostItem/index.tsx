import { CommentOutlined, EllipsisOutlined, LikeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { IPost } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    post: IPost,
}

const PostItem: React.FC<IProps> = ({ post }) => {
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
                <div className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                    <EllipsisOutlined style={{ fontSize: '20px' }} />
                </div>
            </div>
            {/* --- DESCRIPTION */}
            <div className="mb-3 mt-2">
                <p className="text-gray-700">{post.description}</p>
            </div>
            {/* --- IMAGE ----- */}
            <div
                className="w-full h-25rem !bg-cover !bg-no-repeat !bg-center"
                style={{
                    background: `#f7f7f7 url(https://source.unsplash.com/500x400/?food?${new Date().getTime()})`
                }}
            />
            {/* ---- LIKES/COMMENTS DETAILS ---- */}
            <div className="flex justify-space-between my-2">
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
                    {post.commentsCount > 0 && <span>{post.commentsCount} comments</span>}
                </div>
            </div>
            {/* --- LIKE/COMMENT BUTTON */}
            <div className="flex items-center justify-around">
                <span className={`py-2 rounded-md flex items-center justify-center ${post.isLiked ? 'text-indigo-700 font-bold' : 'text-gray-700 hover:text-gray-800'} cursor-pointer hover:bg-gray-100 text-l w-2/4`}>
                    <LikeOutlined />&nbsp; {post.isLiked ? 'Liked' : 'Like'}
                </span>
                <span className="py-2 rounded-md flex items-center justify-center text-gray-700 hover:text-gray-800 cursor-pointer hover:bg-gray-100 text-l w-2/4">
                    <CommentOutlined />&nbsp;Comment
                    </span>
            </div>
        </div>
    );
};

export default PostItem;
