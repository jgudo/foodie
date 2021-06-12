import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '~/redux/action/settingsActions';
import { IRootReducer } from '~/types/types';

const ThemeToggler = () => {
    const { theme } = useSelector((state: IRootReducer) => ({ theme: state.settings.theme }));
    const dispatch = useDispatch();

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            dispatch(setTheme('dark'));
        } else {
            dispatch(setTheme('light'));
        }
    }

    return (
        <label
            className="w-9 h-9 p-2 flex items-center justify-center rounded-full border border-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 dark:border-gray-800 cursor-pointer"
            title={theme === 'dark' ? 'Toggle Light Theme' : 'Toggle Dark Theme'}
        >
            <input
                className="hidden"
                checked={theme === 'dark'}
                type="checkbox"
                id="theme"
                onChange={onThemeChange}
                name="theme-switch"
                hidden
            />
            <svg viewBox="0 0 512.166 512.166">
                <g>
                    <g>
                        <path d="M503.536,289.135c-6.827-5.227-16.384-5.653-23.829-1.408c-2.219,1.259-4.416,2.539-6.699,3.712
			c-50.709,26.624-108.437,31.403-162.517,13.419c-56.469-18.773-102.187-59.755-128.768-115.371
			c-24.128-50.432-29.653-108.245-15.552-162.752c2.176-8.32-0.875-17.109-7.701-22.315c-6.805-5.205-16.085-5.803-23.573-1.536
			C12.186,73.305-34.939,230.937,27.589,361.753c31.659,66.176,86.293,114.987,153.856,137.451
			c25.963,8.619,52.629,12.907,79.168,12.907c40.064,0,79.851-9.749,116.608-29.013c66.027-34.624,114.965-97.259,134.293-171.84
            C513.669,302.959,510.341,294.34,503.536,289.135z"
                            style={{ fill: `${theme === 'dark' ? 'cyan' : '#cacaca'}` }}
                        />
                    </g>
                </g>
            </svg>
        </label>
    );
};

export default ThemeToggler;