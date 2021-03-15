import { CloseCircleOutlined, CloseOutlined, FileImageOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useFileHandler } from '~/hooks';
import { IImage, IRootReducer } from '~/types/types';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    dispatchCreatePost: (form: FormData) => void;
}

Modal.setAppElement('#root');

const CreatePostModal: React.FC<IProps> = (props) => {
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const isLoadingCreatePost = useSelector((state: IRootReducer) => state.loading.isLoadingCreatePost);
    const { imageFile, onFileChange, clearFiles, removeImage } = useFileHandler<IImage[]>('multiple', []);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDescription(val);
    };

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setPrivacy(val);
    }

    const onSubmit = () => {
        if (description) {
            const formData = new FormData();
            formData.set('description', description);
            formData.set('privacy', privacy);

            if (imageFile.length !== 0) {
                imageFile.forEach((image) => {
                    if (image.file) formData.append('photos', image.file);
                });
            }

            props.dispatchCreatePost(formData);
            toast('Creating post...');
            setDescription('');
            clearFiles();
            props.closeModal();
        }
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={props.closeModal}
            contentLabel="Create Post"
            className="modal"
            // shouldCloseOnOverlayClick={!isDeleting}
            overlayClassName="modal-overlay"
        >
            <div className="relative">
                <div
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
                    onClick={props.closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500 dark:text-white" />
                </div>
                <div className="w-full laptop:w-40rem p-4 laptop:px-8">
                    <h2 className="dark:text-white">Create Post</h2>
                    <select
                        className="!py-1 !text-sm w-32 dark:bg-indigo-1100 dark:text-white dark:border-gray-800"
                        id="privacy"
                        name="privacy"
                        onChange={handlePrivacyChange}
                        value={privacy}
                    >
                        <option value="public">Public</option>
                        <option value="follower">Follower</option>
                        <option value="private">Only Me</option>
                    </select>
                    <br />
                    <br />
                    <div className="flex flex-col">
                        <textarea
                            className="dark:bg-indigo-1100 dark:text-white dark:!border-gray-800"
                            cols={3}
                            id="post"
                            name="post"
                            onChange={handleDescriptionChange}
                            placeholder="What's on your mind?"
                            rows={3}
                            readOnly={isLoadingCreatePost}
                            value={description}
                        />
                        <div className="flex items-center">
                            {/* --- UPLOAD OPTIONS */}
                            <div className="flex items-center flex-grow">
                                <input
                                    multiple
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={onFileChange}
                                    readOnly={isLoadingCreatePost}
                                    id="photos"
                                />
                                <label
                                    className="inline-flex items-center cursor-pointer justify-start border-gray-200 text-gray-400 py-2 text-xs"
                                    htmlFor="photos"
                                >
                                    <div
                                        className="group flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-400 hover:border-indigo-700"
                                        title="Upload photo"
                                    >
                                        <FileImageOutlined className="text-xl text-gray-400 hover:text-indigo-700" />
                                    </div>
                                </label>
                            </div>
                            {/* ---- POST BUTTON --- */}
                            <div className="flex justify-end">
                                <button onClick={onSubmit} disabled={isLoadingCreatePost}>Create Post</button>
                            </div>
                        </div>
                        {/*  ---- IMAGES PREVIEWS LIST ----- */}
                        <div className="flex items-center space-x-2">
                            {imageFile && imageFile.map((image) => (
                                <div
                                    className="w-14 h-14 !bg-cover !bg-no-repeat relative"
                                    key={image.id}
                                    style={{
                                        background: `#f7f7f7 url(${image.url})`
                                    }}
                                >
                                    <CloseCircleOutlined
                                        className="p-2 absolute top-0 left-0 right-0 bottom-0 margin-auto text-3xl text-white hover:bg-red-600 cursor-pointer outline-none opacity-75 hover:opacity-100"
                                        onClick={() => removeImage(image.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePostModal;
