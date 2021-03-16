export default () => {

}
// import { DownOutlined } from "@ant-design/icons";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Avatar } from "~/components/shared";

// const Replies = () => {
//     const [replies, setReplies] = useState([]);

//     return (
//         <div
//             className="flex py-2 items-start"
//             key={comment.id}
//         >
//             <Link to={`/user/${comment.author.username}`} className="mr-2">
//                 <Avatar url={comment.author.profilePicture?.url} />
//             </Link>
//             <div className="inline-flex items-start flex-col w-full laptop:w-auto">
//                 <div className="flex items-start">
//                     {/* ------ USERNAME AND COMMENT TEXT ----- */}
//                     <div className="bg-gray-100 dark:bg-indigo-950 px-2 py-1 rounded-md">
//                         <Link to={`/user/${comment.author.username}`}>
//                             <h5 className="dark:text-indigo-400">{comment.author.username}</h5>
//                         </Link>
//                         <p className="text-gray-800 text-sm min-w-full break-all dark:text-gray-200">
//                             {comment.body}
//                         </p>
//                     </div>
//                     {(comment.isOwnComment || comment.isPostOwner) && (
//                         <CommentOptions
//                             setCommentBody={setCommentBody}
//                             comment={comment}
//                             openDeleteModal={deleteModal.openModal}
//                             setTargetID={setTargetID}
//                             setIsUpdating={setIsUpdating}
//                             commentInputRef={commentInputRef}
//                             setInputCommentVisible={setInputCommentVisible}
//                         />
//                     )}
//                 </div>
//                 <div className="mx-2">
//                     {/* ---- DATE AND LIKE BUTTON ----- */}
//                     <div className="mt-1 flex items-center space-x-2">
//                         <span className="text-gray-400 hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 text-xs">Like</span>
//                         <span className="text-gray-400 hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 text-xs">Reply</span>
//                         <span className="text-xs text-gray-400 dark:text-gray-500">
//                             {dayjs(comment.createdAt).fromNow()}
//                         </span>
//                         {comment.isEdited && (
//                             <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
//                                 Edited
//                             </span>
//                         )}
//                     </div>
//                     {comment.replyCount > 0 && (
//                         <span 
//                             className="text-xs text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-200 mt-2 hover:cursor-pointer"
//                             onClick={() => getReplies(comment.id)}
//                         >
//                             View Replies <DownOutlined className="text-1xs" />
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default Replies;
