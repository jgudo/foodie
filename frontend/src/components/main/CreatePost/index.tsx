import { FileImageOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createPostStart } from '~/redux/action/feedActions';
import { IRootReducer } from '~/types/types';

const CreatePost: React.FC = () => {
    const [description, setDescription] = useState('');
    const isLoadingCreatePost = useSelector((state: IRootReducer) => state.loading.isLoadingCreatePost);
    const dispatch = useDispatch();

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDescription(val);
    };

    const onSubmit = () => {
        if (description) {
            dispatch(createPostStart({ description }));
        }
    };

    return (
        <div className="flex flex-col">
            <textarea
                cols={3}
                id="post"
                name="post"
                onChange={handleDescriptionChange}
                placeholder="What's on your mind?"
                rows={3}
                readOnly={isLoadingCreatePost}
                value={description}
            />
            {/* --- UPLOAD OPTIONS */}
            <div>
                <input
                    multiple
                    type="file"
                    hidden
                    readOnly={isLoadingCreatePost}
                    id="photos"
                />
                <label
                    className="inline-flex items-center cursor-pointer justify-start border-gray-200 text-gray-600 py-2 px-4 hover:bg-gray-200"
                    htmlFor="photos"
                >
                    <FileImageOutlined className="text-xl" />
                    <span className="text-lg ml-2">Photos</span>
                </label>
            </div>
            {/* ---- POST BUTTON --- */}
            <div className="flex justify-end">
                <button onClick={onSubmit} disabled={isLoadingCreatePost}>Create Post</button>
            </div>
        </div>
    );
};

export default CreatePost;
