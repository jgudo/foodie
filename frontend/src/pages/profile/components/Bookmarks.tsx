import { StarFilled, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import BookmarkButton from "~/components/main/BookmarkButton";
import Loader from '~/components/shared/Loader';
import { getBookmarks } from "~/services/api";
import { IBookmark } from "~/types/types";

dayjs.extend(relativeTime);

interface IProps {
    username: string;
    isOwnProfile: boolean;
}

interface IBookmarkState {
    items: IBookmark[];
    total: number;
}

const Bookmarks: React.FC<IProps> = ({ username, isOwnProfile }) => {
    const [bookmarks, setBookmarks] = useState<IBookmarkState>({
        items: [],
        total: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    let isMountedRef = useRef<boolean | null>(null);

    useEffect(() => {
        fetchBookmarks();

        if (isMountedRef) isMountedRef.current = true;

        return () => {
            if (isMountedRef) isMountedRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBookmarks = async () => {
        try {
            setIsLoading(true);

            const { bookmarks: result, total } = await getBookmarks();

            if (isMountedRef.current) {
                if (!result || result.length === 0) {
                    setError('You don\'t have any bookmarks.');
                } else {
                    setBookmarks({
                        items: [...bookmarks.items, ...result],
                        total
                    });
                }

                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }

    };

    return (!isOwnProfile && username) ? <Redirect to={`/${username}`} /> : (
        <div className="flex flex-col items-start justify-start w-full min-h-10rem">
            {isLoading && (
                <div className="flex w-full items-center justify-center">
                    <Loader />
                </div>
            )}
            {(bookmarks.items.length === 0 && error && !isLoading) && (
                <div className="w-full p-4 flex items-center justify-center">
                    <span className="text-gray-400 text-lg italic">{error}</span>
                </div>
            )}
            {(bookmarks.items.length !== 0 && !error) && (
                <div className="w-full space-y-4">
                    {bookmarks.items.map(item => (
                        <div key={item.id} className="h-24 flex justify-between bg-white rounded-md shadow-lg overflow-hidden">
                            <div className="flex justify-center items-center">
                                <BookmarkButton postID={item.post.id} initBookmarkState={item.isBookmarked}>
                                    {({ dispatchBookmark, isBookmarked }) => (
                                        <h4
                                            className="p-4 flex items-center cursor-pointer"
                                            onClick={dispatchBookmark}
                                        >
                                            {isBookmarked ? (
                                                <StarFilled className="text-red-600 text-2xl p-2 flex justify-center items-center rounded-full hover:bg-red-100" />
                                            ) : (
                                                    <StarOutlined className="text-red-600 text-2xl p-2 flex justify-center items-center rounded-full hover:bg-red-100" />
                                                )}
                                        </h4>
                                    )}
                                </BookmarkButton>
                            </div>
                            <Link
                                className="flex flex-grow justify-between hover:bg-indigo-100 "
                                key={item.id}
                                to={`/post/${item.post.id}`}
                            >
                                <div className="flex-grow p-2 pb-4 max-w-sm">
                                    <h4 className="break-all overflow-hidden overflow-ellipsis h-12">{item.post.description}</h4>
                                    <span className="text-xs text-gray-400 self-end">Bookmarked {dayjs(item.createdAt).fromNow()}</span>
                                </div>
                                <div
                                    className="w-32 h-full !bg-cover !bg-no-repeat !bg-center"
                                    style={{
                                        background: `#f7f7f7 url(https://source.unsplash.com/500x400/?food?${new Date().getTime()})`
                                    }}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
