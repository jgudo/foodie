import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDidMount } from '~/hooks';
import { setTargetPost } from '~/redux/action/helperActions';
import { hideModal } from '~/redux/action/modalActions';
import { updatePost } from '~/services/api';
import { EModalType, IError, IPost, IRootReducer } from '~/types/types';

interface IProps {
    onAfterOpen?: () => void;
    updateSuccessCallback: (post: IPost) => void;
}

Modal.setAppElement('#root');

const EditPostModal: React.FC<IProps> = (props) => {
    const { isOpen, targetPost } = useSelector((state: IRootReducer) => ({
        isOpen: state.modal.isOpenEditPost,
        targetPost: state.helper.targetPost
    }));
    const [description, setDescription] = useState(targetPost?.description || '');
    const [privacy, setPrivacy] = useState(targetPost?.privacy || 'public');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<IError | null>(null);
    const didMount = useDidMount();
    const dispatch = useDispatch();

    useEffect(() => {
        setPrivacy(targetPost?.privacy as IPost['privacy']);
        setDescription(targetPost?.description as string);
    }, [targetPost]);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDescription(val);
    }

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value as IPost['privacy'];
        setPrivacy(val);
    }

    const handleUpdatePost = async () => {
        try {
            setIsUpdating(true);
            const updatedPost = await updatePost((targetPost?.id as string), { description: description.trim(), privacy });

            if (didMount) {
                setIsUpdating(false);
            }

            props.updateSuccessCallback(updatedPost);
            closeModal();
            toast.dark('Post updated successfully.', {
                progressStyle: { backgroundColor: '#4caf50' }
            });
        } catch (e) {
            if (didMount) {
                setIsUpdating(false);
                setError(e);
            }
        }
    };

    const closeModal = () => {
        if (isOpen && !isUpdating) {
            dispatch(setTargetPost(null));
            dispatch(hideModal(EModalType.EDIT_POST));
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className="modal"
            shouldCloseOnOverlayClick={false}
            overlayClassName="modal-overlay"
        >
            <div className="relative">
                <div
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
                    onClick={closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500 dark:text-white" />
                </div>
                {error && (
                    <span className="p-4 bg-red-100 text-red-500 block">
                        {error?.error?.message || 'Unable process request. Please try again.'}
                    </span>
                )}
                <div className="p-4 laptop:px-8 w-full laptop:w-40rem">
                    <h2 className="dark:text-white">
                        <EditOutlined className="mr-2 pt-2" />
                        Edit Post
                    </h2>
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
                    <label htmlFor="update-post">Description</label>
                    <textarea
                        className="dark:bg-indigo-1100 dark:text-white dark:border-gray-800"
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
                            className="button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-1100"
                            onClick={closeModal}
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
            </div>
        </Modal>
    );
};

export default EditPostModal;
