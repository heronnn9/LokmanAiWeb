import classNames from 'classnames';
import React, { KeyboardEvent, forwardRef } from 'react';

interface CodeInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: boolean;
    autoFocus?: boolean;
}

const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
    (
        {
            value,
            onChange,
            onKeyDown,
            disabled = false,
            error = false,
            autoFocus = false,
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value.slice(-1); // Only take the last character
            onChange(newValue);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select();
        };

        return (
            <input
                ref={ref}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={classNames(
                    'h-[56px] w-full rounded-[4px] px-4',
                    'bg-primary-50 text-center',
                    'text-input-code',
                    'focus:border-primary-500 focus:outline-none focus:ring-0',
                    'transition-all duration-300 ease-in-out',
                    'placeholder:text-input-code',
                    'disabled:bg-primary-100 disabled:text-input-placeholder',
                    'focus:border-primary-500 focus:ring-primary-500',
                    error &&
                        'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                placeholder="X"
                value={value}
                onChange={handleChange}
                onKeyDown={onKeyDown}
                onFocus={handleFocus}
                disabled={disabled}
                autoFocus={autoFocus}
                maxLength={1}
            />
        );
    }
);

CodeInput.displayName = 'CodeInput';

export default CodeInput;
