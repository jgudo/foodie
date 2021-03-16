import { CSSTransition, TransitionGroup } from "react-transition-group";
import { IComment } from "~/types/types";
import CommentItem from "./CommentItem";

interface IProps {
    comments: IComment[];
}

const CommentList: React.FC<IProps> = ({ comments }) => {
    return (
        <TransitionGroup component={null}>
            {comments.map(comment => (
                <CSSTransition
                    timeout={500}
                    classNames="fade"
                    key={comment.id}
                >
                    <CommentItem comment={comment} />
                </CSSTransition>
            ))}
        </TransitionGroup>
    );
};

export default CommentList;
