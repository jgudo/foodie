import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import SearchInput from '~/components/shared/SearchInput';
import { initiateChat } from '~/redux/action/chatActions';
import { IUser } from '~/types/types';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    userID: string;
}

Modal.setAppElement('#root');

const ComposeMessageModal: React.FC<IProps> = (props) => {
    const dispatch = useDispatch();

    const clickSearchResultCallback = (user: IUser) => {
        if (props.userID === user.id) return;
        dispatch(initiateChat(user));
        props.closeModal();
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={props.closeModal}
            contentLabel="Compose Message Modal"
            className="modal"
            shouldCloseOnOverlayClick={true}
            overlayClassName="modal-overlay"
        >
            <div className="relative transition-all pb-8 min-h-18rem">
                <div
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    onClick={props.closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500" />
                </div>
                {/* {(error && likes.length === 0) && (
                    <span className="p-4 bg-red-100 text-red-500 block">
                        {error.error.message}
                    </span>
                )} */}
                <h3 className="py-4 px-8 flex">
                    <FormOutlined className="flex items-center justify-center mr-2" />
                    Compose Message
                </h3>
                <div className="flex justify-start px-8 mt-4">
                    <h4 className="mr-2 pt-2">To: </h4>
                    <SearchInput
                        floatingResult={false}
                        clickItemCallback={clickSearchResultCallback}
                        showNoResultMessage={true}
                    />
                </div>
                {/* {(isLoading && likes.length === 0) && (
                    <div className="flex min-h-10rem min-w-15rem items-center justify-center py-8">
                        <Loader />
                    </div>
                )}
                {likes.length !== 0 && (
                    <div className="p-4 px-4 w-30rem max-h-70vh overflow-y-scroll">
                        <div className="divide-y divide-gray-100">
                            {likes.map(user => (
                                <div key={user.id}>
                                    <UserCard profile={user} isFollowing={user.isFollowing} />
                                </div>
                            ))}
                        </div>
                        {(!isLoading && likes.length >= 10) && (
                            <div className="flex items-center justify-center pt-2 border-t border-gray-100">
                                <span className="text-indigo-700 text-sm font-medium cursor-pointer">
                                    Load more
                                </span>
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center py-8">
                                <span className="text-gray-400 text-sm">No more likes.</span>
                            </div>
                        )}
                    </div>
                )} */}
            </div>

        </Modal>
    );
};

export default ComposeMessageModal;
