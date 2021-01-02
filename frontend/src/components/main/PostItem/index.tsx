import { MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IPost } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    post: IPost
}

const PostItem: React.FC<IProps> = ({ post }) => {
    return (
        <div className="flex bg-white rounded-lg my-4 py-4 px-6">
            <div className="flex justify-between items-center w-full">
                <div className="flex">
                    <div className="rounded-full overflow-hidden relative w-10 h-10 mr-3">
                        <img
                            alt=""
                            className="w-full h-full"
                            src={post.author.profilePicture || 'https://picsum.photos/seed/picsum/200/300'}
                        />
                    </div>
                    <div className="flex flex-col">
                        <h5>{post.author.username}</h5>
                        <span className="text-sm text-gray-500">{dayjs(post.createdAt).fromNow()}</span>
                    </div>
                </div>
                <div>
                    <MoreOutlined style={{ fontSize: '20px' }} />
                </div>
            </div>
        </div>
    );
};

export default PostItem;
