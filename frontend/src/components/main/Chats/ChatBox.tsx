import { CloseOutlined, LineOutlined, SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { closeChat, minimizeChat } from "~/redux/action/chatActions";
import { IChatItemsState } from "~/types/types";

interface IProps {
    user: IChatItemsState;
}

const ChatBox: React.FC<IProps> = ({ user }) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    const onMinimize = () => {
        dispatch(minimizeChat(user.target));
    }

    const onCloseChat = () => {
        dispatch(closeChat(user.target))
    }

    return (
        <div className="bg-white shadow-md p-3 rounded-t-md relative bottom-0 right-20">
            <div className="flex justify-between pb-3 border-b border-gray-200">
                <div className="flex">
                    <div
                        className="w-10 h-10 !bg-cover !bg-no-repeat rounded-full mr-2"
                        style={{ background: `#f8f8f8 url(${user.profilePicture || 'https://i.pravatar.cc/60?' + new Date().getTime()}` }}
                    />
                    <h5>{user.target}</h5>
                </div>
                <div className="flex items-center">
                    <div
                        className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={onMinimize}
                    >
                        <LineOutlined className="flex items-center justify-center" />
                    </div>
                    <div
                        className="post-option-toggle p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={onCloseChat}
                    >
                        <CloseOutlined className="flex items-center justify-center" />
                    </div>
                </div>
            </div>
            {/* --- MESSAGES BODY ---- */}
            <div className="min-h-18rem bg-gray-100">

            </div>
            <div className="flex pt-3 border-t border-gray-200">
                <input
                    className="flex-grow !rounded-r-none !py-0"
                    type="text"
                    placeholder="Send a message..."
                />
                <button className="!rounded-l-none flex items-center justify-center">
                    <SendOutlined className="flex items-center justify-center text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
