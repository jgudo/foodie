import { CloseOutlined } from '@ant-design/icons';
import Modal from 'react-modal';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal?: () => void;
    openModal?: () => void;
}

Modal.setAppElement('#root');

const UpdatePostModal: React.FC<IProps> = (props) => {
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
                <div className="p-4 px-8">
                    <h1>Update Post</h1>
                    <br />
                    <label htmlFor="update-post">Description</label>
                    <textarea
                        name="update-post"
                        id="update-post"
                        cols={30}
                        rows={3}
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            className="button--muted !rounded-full"
                            onClick={props.closeModal}
                        >
                            Cancel
                        </button>
                        <button>Update</button>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default UpdatePostModal;
