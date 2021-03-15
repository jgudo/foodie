import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchInput } from '~/components/shared';
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
    const history = useHistory();

    const clickSearchResultCallback = (user: IUser) => {
        if (props.userID === user.id) return;
        dispatch(initiateChat(user));
        props.closeModal();

        if (window.screen.width < 800) {
            history.push(`/chat/${user.username}`);
        }
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
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
                    onClick={props.closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500 dark:text-white" />
                </div>
                <h3 className="py-4 px-8 flex dark:text-white">
                    <FormOutlined className="mr-2" />
                    Compose Message
                </h3>
                <div className="flex justify-start px-8 mt-4">
                    <h4 className="mr-2 pt-2 dark:text-white">To: </h4>
                    <SearchInput
                        floatingResult={false}
                        clickItemCallback={clickSearchResultCallback}
                        showNoResultMessage={true}
                        preventDefault={true}
                    />
                </div>
            </div>

        </Modal>
    );
};

export default ComposeMessageModal;
