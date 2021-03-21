import { CommentOutlined, LikeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useHistory } from 'react-router-dom';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import thumbnail from '~/images/thumbnail.jpg';
import { IPost } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    posts: IPost[];
    searchQuery: string;
}

const boldString = (str: string, substr: string) => {
    const origStr = str.toUpperCase();
    const sub = substr.toUpperCase();
    const x = origStr.indexOf(sub);
    if (!sub || x === -1) {
        return str;
    }
    const len = sub.length;
    return str.substr(0, x) + '<b><span style="color: #818cf8">' + str.substr(x, len) + '</span></b>' + str.substr(x + len);
}

const Posts: React.FC<IProps> = ({ posts, searchQuery }) => {
    const history = useHistory();
    useDocumentTitle(`Search Posts | Foodie`);

    const onClickPost = (id: string) => {
        history.push(`/post/${id}`);
    };

    const onClickAuthor = (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        history.push(`/user/${username}`);
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => post.author && (
                <div
                    className="h-28 laptop:h-24 flex justify-start bg-white dark:bg-indigo-1100 rounded-md shadow-lg overflow-hidden cursor-pointer border border-transparent hover:border-indigo-700"
                    key={post.id}
                    onClick={(e) => onClickPost(post.id)}
                >
                    <div
                        className="w-24 laptop:w-32 h-full !bg-cover !bg-no-repeat !bg-center"
                        style={{
                            background: `#f7f7f7 url(${post.photos[0]?.url || thumbnail})`
                        }}
                    />
                    <div className="flex-grow p-2 pb-4 max-w-sm">
                        <h4
                            className="break-all overflow-hidden overflow-ellipsis h-12 font-normal dark:text-white"
                            dangerouslySetInnerHTML={{ __html: boldString(post.description, searchQuery) }}
                        >
                        </h4>
                        <div className="flex flex-col laptop:flex-row space-y-2 laptop:space-y-0 self-end">
                            <div className="flex">
                                <h6 className="text-xs text-gray-400 laptop:mr-4">
                                    Posted by
                                    &nbsp;
                                    <span
                                        className="underline text-indigo-700 dark:text-indigo-400 cursor-pointer hover:text-indigo-400"
                                        onClick={(e) => onClickAuthor(e, post.author.username)}
                                    >
                                        {post.author.username}
                                    </span>
                                    &nbsp;
                                    {dayjs(post.createdAt).fromNow()}
                                </h6>
                            </div>
                            <div className="flex space-x-2">
                                <h6 className="text-sm text-gray-600 flex items-center">
                                    {post.likesCount}
                                    &nbsp;
                                    <LikeOutlined />
                                </h6>
                                <h6 className="text-sm text-gray-600 flex items-center">
                                    {post.commentsCount}
                                    &nbsp;
                                    <CommentOutlined />
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
