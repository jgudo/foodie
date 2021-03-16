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
        <div className={`flex items-center py-4 px-2 ${isUpdateMode && 'bg-yellow-100 dark:bg-indigo-1100 rounded-2xl'}`}>
            <Avatar url={userPicture?.url} className="mr-2" />
            <div className="flex-grow">
                <input
                    {...rest}
                    className={`${isSubmitting && isLoading && 'opacity-50'} dark:bg-indigo-1100 dark:!border-gray-800 dark:text-white`}
                    type="text"
                    readOnly={isLoading || isSubmitting}
                    ref={ref}
                />
            </div>
        </div>
    );
});

export default CommentInput;
