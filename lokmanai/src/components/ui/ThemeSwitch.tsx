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
        <div
            onClick={toggleTheme}
            className="bg-primary-500  focus:ring-primary-500 cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Toggle theme"
        >
            <span
                className={`dark:bg-primary-900 inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-600 ${
                    theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
                }`}
            >
                <div className="flex h-full w-full items-center justify-center">
                    {theme === 'dark' ? (
                        <Icon
                            icon="star"
                            size={16}
                            color="#fbbf24"
                        />
                    ) : (
                        <Icon
                            icon="star-filled"
                            size={16}
                            color="#f59e0b"
                        />
                    )}
                </div>
            </span>
        </div>
    );
};

export default ThemeSwitch;
