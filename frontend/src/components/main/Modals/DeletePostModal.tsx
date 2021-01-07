import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Modal from 'react-modal';
import { deletePost } from '~/services/api';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    postID: string;
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
        } catch (e) {
            setIsDeleting(false);
            setError('Unable process request. Please try again.');
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
                shouldCloseOnOverlayClick={!isDeleting}
                overlayClassName="modal-overlay"
            >
                <CloseOutlined className="p-2 absolute right-2 top-2 outline-none text-gray-500" onClick={props.closeModal} />
                <div className="p-4 px-8">
                    {error && <span className="p-4 bg-red-100 text-red-500 w-full">{error}</span>}
                    <h1>Delete Post</h1>
                    <p className="text-gray-600">Are you sure you want to delete this post?</p>
                    <br />
                    <div className="flex justify-between">
                        <button
                            className="button--muted !rounded-full"
                            onClick={props.closeModal}
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
