import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { updatePost } from '~/services/api';
import { IPost } from '~/types/types';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    post: IPost;
    updateSuccessCallback: (post: IPost) => void;
}

Modal.setAppElement('#root');

const UpdatePostModal: React.FC<IProps> = (props) => {
    const [description, setDescription] = useState(props.post.description || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDescription(val);
    }

    const handleUpdatePost = async () => {
        try {
            setIsUpdating(true);
            const updatedPost = await updatePost(props.post.id, { description: description.trim() });

            props.updateSuccessCallback(updatedPost);
            setIsUpdating(false);
            props.closeModal();
            toast.dark('Post updated successfully.', {
                progressStyle: { backgroundColor: '#4caf50' }
            });
        } catch (e) {
            setIsUpdating(false);
            setError('Unable to update post. Please try again later.');
        }
    };

    return (
        <div>
            <Modal
                isOpen={props.isOpen}
                onAfterOpen={props.onAfterOpen}
                onRequestClose={props.closeModal}
                contentLabel="Example Modal"
                className="modal"
                shouldCloseOnOverlayClick={false}
                overlayClassName="modal-overlay"
            >
                <CloseOutlined className="p-2 absolute right-2 top-2 outline-none text-gray-500" onClick={props.closeModal} />
                {error && <span className="p-4 bg-red-100 text-red-500 block w-full">{error}</span>}
                <div className="p-4 px-8 w-40rem">
                    <h1>Update Post</h1>
                    <br />
                    <label htmlFor="update-post">Description</label>
                    <textarea
                        name="update-post"
                        id="update-post"
                        cols={30}
                        rows={3}
                        readOnly={isUpdating}
                        onChange={handleDescriptionChange}
                        value={description}
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            className="button--muted !rounded-full"
                            onClick={props.closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdatePost}
                            disabled={isUpdating}
                        >
                            Update
                        </button>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default UpdatePostModal;
