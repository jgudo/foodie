import { IMessage } from "~/types/types";

interface IProps {
    messages: IMessage[];
}

const MessagesList: React.FC<IProps> = ({ messages }) => {
    return (
        <div>
            {messages.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-400 italic">No Messages.</p>
                </div>
            ) : (
                    <div>
                        <h1>Messages</h1>
                    </div>
                )}
        </div>
    );
};

export default MessagesList;
