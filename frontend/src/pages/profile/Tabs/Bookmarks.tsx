import { LoadingOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Link, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BookmarkButton } from "~/components/main";
import { Loader } from '~/components/shared';
import { useDidMount, useDocumentTitle } from '~/hooks';
import thumbnail from '~/images/thumbnail.jpg';
import { getBookmarks } from "~/services/api";
import { IBookmark, IError } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    username: string;
    isOwnProfile: boolean;
}

const Bookmarks: React.FC<IProps> = ({ username, isOwnProfile }) => {
    const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IError | null>(null);
    const [offset, setOffset] = useState(0);
    const didMount = useDidMount(true);

    useDocumentTitle(`Bookmarks - ${username} | Foodie`);
    useEffect(() => {
        fetchBookmarks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBookmarks = async () => {
        try {
            setIsLoading(true);

            const data = await getBookmarks({ offset });

            if (didMount) {
                setBookmarks(data);
                setOffset(offset + 1);

                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
            if (didMount) {
                setIsLoading(false);
                setError(e);
            }
        }
    };

    const infiniteRef = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !error && bookmarks.length >= 10,
        onLoadMore: fetchBookmarks,
        scrollContainer: 'window',
        threshold: 200
    });

    return (!isOwnProfile && username) ? <Redirect to={`/user/${username}`} /> : (
        <div className="flex flex-col items-start justify-start w-full min-h-10rem">
            {(isLoading && bookmarks.length === 0) && (
                <div className="flex w-full items-center justify-center min-h-10rem">
                    <Loader />
                </div>
            )}
            {(bookmarks.length === 0 && error && !isLoading) && (
                <div className="w-full p-4 flex min-h-10rem items-center justify-center">
                    <span className="text-gray-400 text-lg italic">
                        {error?.error?.message || "Something went wrong :("}
                    </span>
                </div>
            )}
            {(bookmarks.length !== 0 && !error) && (
                <div className="w-full space-y-4" ref={infiniteRef as React.RefObject<HTMLDivElement>}>
                    <h4 className="text-gray-700 dark:text-white mb-4 ml-4 mt-4 laptop:mt-0">Bookmarks</h4>
                    <TransitionGroup component={null}>
                        {bookmarks.map(item => (
                            <CSSTransition
                                timeout={500}
                                classNames="fade"
                                key={item.id}
                            >
                                <div key={item.id} className="h-24 flex justify-between bg-white dark:bg-indigo-1000 rounded-md shadow-lg overflow-hidden">
                                    <div className="flex justify-center items-center">
                                        <BookmarkButton postID={item.post.id} initBookmarkState={item.isBookmarked}>
                                            {({ dispatchBookmark, isBookmarked, isLoading }) => (
                                                <h4
                                                    className="p-4 flex items-center cursor-pointer"
                                                    onClick={dispatchBookmark}
                                                >
                                                    {isLoading
                                                        ? <LoadingOutlined className="text-gray-600 text-2xl p-2 dark:text-white" />
                                                        : isBookmarked ? (
                                                            <StarFilled className="text-red-600 text-2xl p-2 rounded-full hover:bg-red-100" />
                                                        ) : (
                                                            <StarOutlined className="text-red-600 text-2xl p-2 rounded-full hover:bg-red-100" />
                                                        )}
                                                </h4>
                                            )}
                                        </BookmarkButton>
                                    </div>
                                    <Link
                                        className="flex flex-grow justify-between hover:bg-indigo-100 border border-transparent dark:hover:bg-indigo-1000 dark:hover:border-gray-800"
                                        key={item.id}
                                        to={`/post/${item.post.id}`}
                                    >
                                        <div className="flex-grow p-2 pb-4 max-w-sm">
                                            <h4 className="break-all overflow-hidden overflow-ellipsis h-8 laptop:h-12 dark:text-indigo-400">
                                                {item.post.description}
                                            </h4>
                                            <span className="text-xs text-gray-400 self-end">Bookmarked {dayjs(item.createdAt).fromNow()}</span>
                                        </div>
                                        <div
                                            className="w-32 h-full !bg-cover !bg-no-repeat !bg-center"
                                            style={{
                                                background: `#f7f7f7 url(${item.post.photos[0]?.url || thumbnail})`
                                            }}
                                        />
                                    </Link>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                    {(bookmarks.length !== 0 && !error && isLoading) && (
                        <div className="flex justify-center py-6">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
