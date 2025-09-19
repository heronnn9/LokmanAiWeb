import React from 'react';
import Icon from '../../../Icon';

interface PasswordToggleButtonProps {
    isVisible: boolean;
    onToggle: () => void;
    isError: boolean;
}

const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({
    isVisible,
    onToggle,
    isError,
}) => {
    return (
        <button
            type="button"
            id="password-toggle"
            className="absolute right-4"
            onClick={onToggle}
            tabIndex={-1}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
            <Icon
                icon={isVisible ? 'eye-open' : 'eye-close'}
                color={isError ? '#FF2B2B' : '#001732'}
                className="dark:brightness-0 dark:invert"
            />
        </button>
    );
};

export default PasswordToggleButton;
