import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/components/shared';
import { useDidMount } from '~/hooks';
import { setTargetPost } from '~/redux/action/helperActions';
import { hideModal } from '~/redux/action/modalActions';
import { getPostLikes } from '~/services/api';
import { EModalType, IError, IProfile, IRootReducer } from '~/types/types';
import UserCard from '../UserCard';

interface IProps {
    onAfterOpen?: () => void;
}

Modal.setAppElement('#root');

const PostLikesModal: React.FC<IProps> = (props) => {
    const [likes, setLikes] = useState<IProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState<IError | null>(null);
    const didMount = useDidMount(true);
    const dispatch = useDispatch();
    const { isOpen, targetPost } = useSelector((state: IRootReducer) => ({
        isOpen: state.modal.isOpenPostLikes,
        targetPost: state.helper.targetPost
    }));

    useEffect(() => {
        if (isOpen && targetPost) {
            fetchLikes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchLikes = async (initOffset = 0) => {
        try {
            setIsLoading(true);
            const result = await getPostLikes(targetPost?.id as string, { offset: initOffset });

            if (didMount) {
                setOffset(offset + 1);
                setLikes(result);
                setIsLoading(false);
            }
        } catch (e) {
            if (didMount) {
                setIsLoading(false);
                setError(e);
            }
        }
    };

    const closeModal = () => {
        if (isOpen) {
            dispatch(hideModal(EModalType.POST_LIKES));
            dispatch(setTargetPost(null));
        }
    }

    return !isOpen ? null : (
        <Modal
            isOpen={isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className="modal"
            shouldCloseOnOverlayClick={true}
            overlayClassName="modal-overlay"
        >
            <div className="relative transition-all min-w-15rem">
                <div
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
                    onClick={closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500 dark:text-white" />
                </div>
                {(error && likes.length === 0) && (
                    <span className="p-4 bg-red-100 text-red-500 block">
                        {error.error.message}
                    </span>
                )}
                <h3 className="py-4 px-8 dark:text-white">Likes</h3>
                {(isLoading && likes.length === 0) && (
                    <div className="flex min-h-10rem min-w-15rem items-center justify-center py-8">
                        <Loader />
                    </div>
                )}
                {likes.length !== 0 && (
                    <div className="p-4 px-4 w-full laptop:w-30rem max-h-70vh overflow-y-scroll scrollbar">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {likes.map(user => (
                                <div key={user.id}>
                                    <UserCard profile={user} />
                                </div>
                            ))}
                        </div>
                        {(!isLoading && likes.length >= 10 && !error) && (
                            <div className="flex items-center justify-center pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span
                                    className="text-indigo-700 dark:text-indigo-400 text-sm font-medium cursor-pointer"
                                    onClick={() => fetchLikes(offset)}
                                >
                                    Load more
                                </span>
                            </div>
                        )}
                        {(isLoading && !error) && (
                            <div className="flex w-full items-center justify-center py-8">
                                <Loader />
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center py-8">
                                <span className="text-gray-400 text-sm">No more likes.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </Modal>
    );
};

export default PostLikesModal;
