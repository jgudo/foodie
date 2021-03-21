import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDidMount } from '~/hooks';
import { bookmarkPost } from '~/services/api';

interface IProps {
    postID: string;
    initBookmarkState: boolean;
    children: (props: any) => React.ReactNode;
}

const BookmarkButton: React.FC<IProps> = (props) => {
    const [isBookmarked, setIsBookmarked] = useState(props.initBookmarkState || false);
    const [isLoading, setLoading] = useState(false);
    const didMount = useDidMount(true);

    useEffect(() => {
        setIsBookmarked(props.initBookmarkState);
    }, [props.initBookmarkState]);

    const dispatchBookmark = async () => {
        if (isLoading) return;

        try {
            // state = TRUE | FALSE
            setLoading(true);
            const { state } = await bookmarkPost(props.postID);

            if (didMount) {
                setIsBookmarked(state);
                setLoading(false);
            }

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
            didMount && setLoading(false);
            console.log(e);
        }
    }

    return (
        <div>
            { props.children({ dispatchBookmark, isBookmarked, isLoading })}
        </div>
    );
};

export default BookmarkButton;
