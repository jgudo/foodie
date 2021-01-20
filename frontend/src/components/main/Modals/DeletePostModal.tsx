import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { deletePost } from '~/services/api';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    postID: string;
    deleteSuccessCallback: (postID: string) => void;
}

Modal.setAppElement('#root');

const DeletePostModal: React.FC<IProps> = (props) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDeletePost = async () => {
        try {
            setIsDeleting(true);
            await deletePost(props.postID);

            props.closeModal();
            props.deleteSuccessCallback(props.postID);
            toast.dark('Post successfully deleted.', {
                progressStyle: { backgroundColor: '#4caf50' }
            });
        } catch (e) {
            setIsDeleting(false);
            setError('Unable process request. Please try again.');
        }
    };

    const onCloseModal = () => {
        if (!isDeleting) {
            props.closeModal();
        }
    }

    return (
        <div>
            <Modal
                isOpen={props.isOpen}
                onAfterOpen={props.onAfterOpen}
                onRequestClose={props.closeModal}
                contentLabel="Example Modal"
                className="modal"
                shouldCloseOnOverlayClick={!isDeleting}
                overlayClassName="modal-overlay"
            >
                <div
                    className="absolute right-2 top-2 p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    onClick={onCloseModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500" />
                </div>
                {error && <span className="p-4 bg-red-100 text-red-500 w-full">{error}</span>}
                <div className="p-4 px-8">
                    <h1>Delete Post</h1>
                    <p className="text-gray-600">Are you sure you want to delete this post?</p>
                    <br />
                    <div className="flex justify-between">
                        <button
                            className="button--muted !rounded-full"
                            onClick={props.closeModal}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="button--danger"
                            disabled={isDeleting}
                            onClick={handleDeletePost}
                        >
                            Delete
                        </button>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default DeletePostModal;
