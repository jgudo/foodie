import { CloseCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import useFileHandler from '~/hooks/useFileHandler';
import { createPostStart } from '~/redux/action/feedActions';
import { IImage, IRootReducer } from '~/types/types';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
}

Modal.setAppElement('#root');

const CreatePostModal: React.FC<IProps> = (props) => {
    const [description, setDescription] = useState('');
    const isLoadingCreatePost = useSelector((state: IRootReducer) => state.loading.isLoadingCreatePost);
    const dispatch = useDispatch();
    const { imageFile, onFileChange, clearFiles, removeImage } = useFileHandler<IImage[]>('multiple', []);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDescription(val);
    };

    const onSubmit = () => {
        if (description) {
            const formData = new FormData();
            formData.set('description', description);

            if (imageFile.length !== 0) {
                imageFile.forEach((image) => {
                    if (image.file) formData.append('photos', image.file);
                });
            }

            dispatch(createPostStart(formData));
            setDescription('');
            clearFiles();
            props.closeModal();
        }
    };

    const handleCancel = () => {
        setDescription('');
        clearFiles();
        props.closeModal();
    }

    useEffect(() => {
        console.log(imageFile);
    }, [imageFile])

    return (
        <>
            <Modal
                isOpen={props.isOpen}
                onAfterOpen={props.onAfterOpen}
                onRequestClose={props.closeModal}
                contentLabel="Create Post"
                className="modal"
                // shouldCloseOnOverlayClick={!isDeleting}
                overlayClassName="modal-overlay"
            >
                <CloseOutlined
                    className="p-2 absolute right-2 top-2 outline-none text-gray-500"
                    onClick={props.closeModal}
                />
                {/* {error && <span className="p-4 bg-red-100 text-red-500 w-full">{error}</span>} */}
                <div className="w-40rem p-4 px-8">
                    <h1>Create Post</h1>
                    <br />
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
                                    className="inline-flex items-center cursor-pointer justify-start border-gray-200 text-gray-600 py-2"
                                    htmlFor="photos"
                                >
                                    <div className="group flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-400 hover:border-indigo-700">
                                        <PlusOutlined className="text-xl flex items-center justify-center text-gray-400 hover:text-indigo-700" />
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
                                        className="flex items-center justify-center p-2 absolute top-0 left-0 right-0 bottom-0 margin-auto text-3xl text-white hover:bg-red-600 cursor-pointer outline-none opacity-75 hover:opacity-100"
                                        onClick={() => removeImage(image.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    );
};

export default CreatePostModal;
