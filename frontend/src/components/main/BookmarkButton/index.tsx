import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { bookmarkPost } from '~/services/api';

interface IProps {
    postID: string;
    initBookmarkState: boolean;
    children: (props: any) => React.ReactNode;
}

const BookmarkButton: React.FC<IProps> = (props) => {
    const [isBookmarked, setIsBookmarked] = useState(props.initBookmarkState || false);

    useEffect(() => {
        setIsBookmarked(props.initBookmarkState);
    }, [props.initBookmarkState]);

    const dispatchBookmark = async () => {
        try {
            // state = TRUE | FALSE
            const { state } = await bookmarkPost(props.postID);
            setIsBookmarked(state);

            if (state) {
                toast.dark('Post successfully bookmarked.', {
                    hideProgressBar: true,
                    autoClose: 2000
                });
            } else {
                toast.info('Post removed from bookmarks.', {
                    hideProgressBar: true,
                    autoClose: 2000
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            { props.children({ dispatchBookmark, isBookmarked })}
        </div>
    );
};

export default BookmarkButton;
