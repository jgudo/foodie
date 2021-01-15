import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Badge from '~/components/shared/Badge';
import { IMessage } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    messages: IMessage[];
    userID: string;
    handleReadMessage: (senderID: string) => void;
}

const MessagesList: React.FC<IProps> = ({ messages, userID, handleReadMessage }) => {
    return (
        <div>
            {messages.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-400 italic">No Messages.</p>
                </div>
            ) : (
                    <div>
                        {messages.map(message => {
                            const self = message.to.id !== userID;

                            return (
                                <div
                                    className={`flex justify-start cursor-pointer hover:bg-gray-100 px-2 py-3 relative ${(!message.seen && !self) && 'bg-indigo-100 hover:bg-indigo-200'}`}
                                    key={message.id}
                                    onClick={() => handleReadMessage(message.from.id)}
                                >
                                    {/* --- IMAGE--- */}
                                    <div
                                        className="w-12 h-12 !bg-cover !bg-no-repeat rounded-full mr-2"
                                        style={{ background: `#f8f8f8 url(${!self ? message.from.profilePicture : message.to.profilePicture})` }}
                                    />
                                    <div className="relative flex-grow">
                                        {/* --- USERNAME --- */}
                                        <h5 className={`${(!message.seen && !self) && 'font-bold text-gray-800'} text-gray-500`}>
                                            {!self ? message.from.username : message.to.username}
                                        </h5>
                                        {/* -- MESSAGE--- */}
                                        <span className={`block max-w-sm whitespace-nowrap overflow-hidden overflow-ellipsis ${(message.seen || self) ? 'text-gray-400' : 'text-indigo-600 font-medium'} text-sm`}>
                                            {self && 'You:'} {message.text}
                                        </span>
                                        {/* --- DATE --- */}
                                        <span className="absolute right-4 top-1 text-xs text-gray-400">
                                            {dayjs(message.createdAt).fromNow()}
                                        </span>
                                        {/* --- BADGE ---- */}
                                        {!self && (
                                            <div className="absolute  bottom-2 right-4 w-2 h-2">
                                                <Badge count={message.unseenCount || 0} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
        </div>
    );
};

export default MessagesList;
