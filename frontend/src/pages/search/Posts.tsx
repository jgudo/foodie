import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IPost } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    posts: IPost[];
}

const Posts: React.FC<IProps> = ({ posts }) => {
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="h-24 flex justify-start bg-white rounded-md shadow-lg overflow-hidden">
                    <div
                        className="w-32 h-full !bg-cover !bg-no-repeat !bg-center"
                        style={{
                            background: `#f7f7f7 url(https://source.unsplash.com/500x400/?food?${new Date().getTime()})`
                        }}
                    />
                    <div className="flex-grow p-2 pb-4 max-w-sm">
                        <h4 className="break-all overflow-hidden overflow-ellipsis h-12">{post.description}</h4>
                        <span className="text-xs text-gray-400 self-end">Bookmarked {dayjs(post.createdAt).fromNow()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
