import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { search } from '~/services/api';
import { IProfile, IUser } from '~/types/types';
import Avatar from './Avatar';
import Loader from './Loader';

interface IProps {
    floatingResult?: boolean;
    clickItemCallback?: (user: IUser) => void;
    showNoResultMessage?: boolean;
}

const SearchInput: React.FC<IProps> = (props) => {
    const [searchInput, setSearchInput] = useState('');
    const [isSuggesting, setSuggesting] = useState(false);
    const [suggestions, setSuggestions] = useState<IProfile[]>([]);
    const [isVisibleSuggestion, setVisibleSuggestion] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        const target = (e.target as HTMLDivElement).closest('.input-wrapper');

        if (!target && isVisibleSuggestion) {
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
                const users = await search({ q: val, limit: 5 });

                if (users.length === 0) {
                    setError('No suggestion found.');
                } else {
                    setError('');
                }

                setSuggestions(users);
                setSuggesting(false);
            } catch (e) {
                setSuggesting(false);
                setError(e.error.message);
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
        if (e.key === 'Enter' && searchInput) {
            history.push({
                pathname: '/search',
                search: `q=${searchInput.trim()}`
            });
            setVisibleSuggestion(false);
        }
    }

    return (
        <div className="input-wrapper relative flex flex-col items-center w-20rem">
            <SearchOutlined className="flex items-center justify-center text-gray-200 absolute left-3 top-3 z-10" />
            <input
                className="!border-gray-100 !pl-10 !py-2"
                placeholder="Search..."
                type="text"
                onFocus={onFocusInput}
                onChange={debounce(onSearchInputChange, 200)}
                onKeyDown={onSearchSubmit}
            />
            {(searchInput && isVisibleSuggestion) && (
                <div className={` bg-white shadow-lg rounded-md w-full flex justify-center flex-col overflow-hidden ${props.floatingResult ? 'absolute top-10' : 'relative top-0'}`}>
                    {(!props.showNoResultMessage && !error) && (
                        <h6 className="p-4 text-xs border-b border-gray-100">Search Suggestion</h6>
                    )}
                    {(isSuggesting && !error) && (
                        <div className="flex items-center justify-center p-4">
                            <Loader />
                        </div>
                    )}
                    {(!isSuggesting && !error && suggestions.length !== 0) && suggestions.map((user) => (
                        <div
                            className="hover:bg-indigo-100 p-2 cursor-pointer"
                            key={user.id}
                            onClick={() => onClickItem(user)}
                        >
                            <div className="flex items-center">
                                <Avatar url={user.profilePicture} className="mr-2" />
                                <h6 className="mr-10 text-sm max-w-md overflow-ellipsis overflow-hidden">{user.username}</h6>
                            </div>
                        </div>
                    ))}
                    {(error && suggestions.length === 0 && props.showNoResultMessage) && (
                        <div className="flex items-center justify-center p-4">
                            <span className="text-gray-400 text-sm italic">No user found.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

SearchInput.defaultProps = {
    floatingResult: true,
    showNoResultMessage: false
}

export default SearchInput;
