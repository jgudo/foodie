import React, { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDidMount } from "~/hooks";
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

    useEffect(() => {
        console.log('LIST MOUNTED', comments);
        setReplies(comments);
    }, [comments]);

    const deleteSuccessCallback = (commentID: string) => {
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
                    <CommentItem comment={comment} />
                </CSSTransition>
            ))}
            {/* ---- DELETE MODAL ---- */}
            <DeleteCommentModal deleteSuccessCallback={deleteSuccessCallback} />
        </TransitionGroup>
    );
};

export default memo(CommentList);
