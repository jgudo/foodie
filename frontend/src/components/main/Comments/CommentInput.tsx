import React, { forwardRef } from "react";
import { Avatar } from "~/components/shared";

interface IProps {
    isLoading: boolean;
    isSubmitting: boolean;
    isUpdateMode: boolean;
    userPicture: {
        url: string;
        [prop: string]: any;
    },
    [prop: string]: any;
}

const CommentInput = forwardRef<HTMLInputElement, IProps>((props, ref) => {
    const { isUpdateMode, isSubmitting, userPicture, isLoading, ...rest } = props;

    return (
        <div className={`flex items-center`}>
            {!isUpdateMode && <Avatar url={userPicture?.url} className="mr-2 flex-shrink-0" size="sm" />}
            <div className="flex-grow">
                <input
                    {...rest}
                    className={`${isSubmitting && isLoading && 'opacity-50'} dark:bg-indigo-1100 dark:!border-gray-800 dark:text-white`}
                    type="text"
                    readOnly={isLoading || isSubmitting}
                    ref={ref}
                />
                {isUpdateMode && <span className="text-xs text-gray-500 ml-2">Press Esc to Cancel</span>}
            </div>
        </div>
    );
});

export default CommentInput;
