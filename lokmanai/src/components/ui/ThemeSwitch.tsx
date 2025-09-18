'use client';

import { useTheme } from 'next-themes';
import Icon from './Icon';

const ThemeSwitch = () => {
    const { setTheme } = useTheme();
    const { theme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="bg-primary-100 focus:ring-primary-500 dark:bg-primary-700 relative inline-flex h-12 w-20 items-center rounded-full p-1 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Toggle theme"
        >
            <span
                className={`dark:bg-primary-900 inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-600 ${
                    theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
                }`}
            >
                <div className="flex h-full w-full items-center justify-center">
                    {theme === 'dark' ? (
                        <Icon
                            icon="star"
                            size={20}
                            color="#fbbf24"
                        />
                    ) : (
                        <Icon
                            icon="star-filled"
                            size={20}
                            color="#f59e0b"
                        />
                    )}
                </div>
            </span>
        </button>
    );
};

export default ThemeSwitch;
