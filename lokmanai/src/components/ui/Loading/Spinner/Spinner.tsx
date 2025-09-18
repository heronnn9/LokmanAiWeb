// Spinner component
import React from 'react';
import classNames from 'classnames';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'white' | 'danger';
    className?: string;
}

const Spinner = ({
    size = 'md',
    color = 'secondary',
    className,
}: SpinnerProps) => {
    return (
        <div
            className={classNames(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                // Size variations
                {
                    'h-4 w-4': size === 'sm',
                    'h-6 w-6': size === 'md',
                    'h-8 w-8': size === 'lg',
                },
                // Color variations
                {
                    'text-primary-500': color === 'primary',
                    'text-secondary-500': color === 'secondary',
                    'text-white': color === 'white',
                    'text-danger-500': color === 'danger',
                },
                className
            )}
            role="status"
            aria-label="loading"
        >
            <span className="sr-only">Yükleniyor...</span>
        </div>
    );
};

export default Spinner;