import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Loader } from '~/components/shared';
import { search } from '~/services/api';
import { IError, IProfile, IUser } from '~/types/types';

interface IProps {
    floatingResult?: boolean;
    clickItemCallback?: (user: IUser) => void;
    showNoResultMessage?: boolean;
    inputClassName?: string;
    preventDefault?: boolean;
}

const SearchInput: React.FC<IProps> = (props) => {
    const [searchInput, setSearchInput] = useState('');
    const [isSuggesting, setSuggesting] = useState(false);
    const [suggestions, setSuggestions] = useState<IProfile[]>([]);
    const [isVisibleSuggestion, setVisibleSuggestion] = useState(false);
    const [error, setError] = useState<IError | null>(null);
    const history = useHistory();
    const isVisibleSuggestionRef = useRef(isVisibleSuggestion);

    useEffect(() => {
        isVisibleSuggestionRef.current = isVisibleSuggestion;
    }, [isVisibleSuggestion]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        const target = (e.target as HTMLDivElement).closest('.input-wrapper');

        if (!target && isVisibleSuggestionRef.current) {
            setVisibleSuggestion(false);
        }
    }

    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        const val = e.target.value;
        setSearchInput(val);

        (async () => {
            try {
                setSuggesting(true);
                setError(null);
                const users = await search({ q: val, limit: 5 });

                setSuggestions(users as IProfile[]);
                setSuggesting(false);
            } catch (e) {
                setSuggesting(false);
                setSuggestions([]);
                setError(e);
            }
        })();
    }

    const onFocusInput = (e: React.FocusEvent<HTMLInputElement>) => {
        setVisibleSuggestion(true);
        e.target.select();
    }

    const onClickItem = (user: IUser) => {
        if (props.clickItemCallback) {
            props.clickItemCallback(user);
        } else {
            history.push(`/user/${user.username}`);
            setVisibleSuggestion(false);
        }
    }

    const onSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // props.preventDefault to stop dispatching the event when enter key pressed
        if (e.key === 'Enter' && searchInput && !props.preventDefault) {
            history.push({
                pathname: '/search',
                search: `q=${searchInput.trim()}&type=users`
            });
            setVisibleSuggestion(false);
        }
    }

    return (
        <div className={`input-wrapper relative flex flex-col items-center ${props.inputClassName}`}>
            <SearchOutlined className="text-gray-400 absolute left-3 top-3 z-50" />
            <input
                className="!border-gray-100 !pl-10 !py-2 dark:bg-indigo-1000 dark:!border-gray-800 dark:text-white"
                placeholder="Search..."
                type="text"
                onFocus={onFocusInput}
                onChange={debounce(onSearchInputChange, 200)}
                onKeyDown={onSearchSubmit}
            />
            {(searchInput && isVisibleSuggestion) && (
                <div className={` bg-white dark:bg-indigo-1000 shadow-lg rounded-md w-full flex justify-center flex-col overflow-hidden ${props.floatingResult ? 'absolute top-12' : 'relative top-0'}`}>
                    {(!props.showNoResultMessage && !error) && (
                        <h6 className="p-4 text-xs border-b dark:text-white border-gray-100 dark:border-gray-800">Search Suggestion</h6>
                    )}
                    {(isSuggesting && !error) && (
                        <div className="flex items-center justify-center p-4">
                            <Loader />
                        </div>
                    )}
                    {(!isSuggesting && !error && suggestions.length !== 0) && suggestions.map((user) => (
                        <div
                            className="hover:bg-indigo-100 dark:hover:bg-indigo-900 p-2 cursor-pointer"
                            key={user.id}
                            onClick={() => onClickItem(user)}
                        >
                            <div className="flex items-center">
                                <Avatar url={user.profilePicture?.url} className="mr-2" />
                                <h6 className="mr-10 text-sm max-w-md overflow-ellipsis overflow-hidden dark:text-white">{user.username}</h6>
                            </div>
                        </div>
                    ))}
                    {(error && suggestions.length === 0 && props.showNoResultMessage) && (
                        <div className="flex items-center justify-center p-4">
                            <span className="text-gray-400 text-sm italic">
                                {error?.error?.message || 'Something went wrong :('}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

SearchInput.defaultProps = {
    floatingResult: true,
    showNoResultMessage: false,
    inputClassName: 'w-20rem',
    preventDefault: false
}

export default SearchInput;
