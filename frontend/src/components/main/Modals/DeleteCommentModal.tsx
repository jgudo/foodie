import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { deleteComment } from '~/services/api';
import { IError } from '~/types/types';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    commentID: string;
    deleteSuccessCallback: (commentID: string) => void;
}

Modal.setAppElement('#root');

const DeleteCommentModal: React.FC<IProps> = (props) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<IError | null>(null);

    const handleDeleteComment = async () => {
        try {
            setIsDeleting(true);
            await deleteComment(props.commentID);

            props.closeModal();
            props.deleteSuccessCallback(props.commentID);
            toast.dark('Comment successfully deleted.', {
                progressStyle: { backgroundColor: '#4caf50' },
                autoClose: 2000
            });
            setIsDeleting(false);
        } catch (e) {
            setIsDeleting(false);
            setError(e);
        }
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={props.closeModal}
            contentLabel="Delete Comment"
            className="modal"
            shouldCloseOnOverlayClick={!isDeleting}
            overlayClassName="modal-overlay"
        >
            <div className="relative">
                <div
                    className="absolute right-2 top-2 p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    onClick={props.closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500" />
                </div>
                {error && (
                    <span className="p-4 bg-red-100 text-red-500 w-full">
                        {error?.error?.message || 'Unable process request. Please try again.'}
                    </span>
                )}
                <div className="p-4 px-8">
                    <h1>Delete Comment</h1>
                    <p className="text-gray-600">Are you sure you want to delete this comment?</p>
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
                            onClick={handleDeleteComment}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

        </Modal>
    );
};

export default DeleteCommentModal;
