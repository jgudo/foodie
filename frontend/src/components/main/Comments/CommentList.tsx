import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDidMount, useModal } from "~/hooks";
import { setTargetCommentID } from "~/redux/action/helperActions";
import { IComment } from "~/types/types";
import { DeleteCommentModal } from "../Modals";
import CommentItem from "./CommentItem";

interface IProps {
    comments: IComment[];
}

const CommentList: React.FC<IProps> = ({ comments }) => {
    const didMount = useDidMount();
    const dispatch = useDispatch();
    const [replies, setReplies] = useState<IComment[]>(comments);
    const { isOpen, closeModal, openModal } = useModal();

    useEffect(() => {
        console.log('LIST MOUNTED', comments);
        setReplies(comments);
    }, [comments]);

    const deleteSuccessCallback = (commentID: string) => {
        console.log('CALLBACK', replies)
        console.log('CALLBACK COMMENTS', comments)
        if (didMount) {
            dispatch(setTargetCommentID(''));
            setReplies(oldComments => {
                console.log(oldComments);
                return oldComments.filter((comment) => comment.id !== commentID)
            });
        }
    }

    return (
        <TransitionGroup component={null}>
            {replies.map(comment => (
                <CSSTransition
                    timeout={500}
                    classNames="fade"
                    key={comment.id}
                >
                    <CommentItem openDeleteModal={openModal} comment={comment} />
                </CSSTransition>
            ))}
            {/* ---- DELETE MODAL ---- */}
            <DeleteCommentModal
                isOpen={isOpen}
                closeModal={closeModal}
                deleteSuccessCallback={deleteSuccessCallback}
            />
        </TransitionGroup>
    );
};

export default CommentList;
