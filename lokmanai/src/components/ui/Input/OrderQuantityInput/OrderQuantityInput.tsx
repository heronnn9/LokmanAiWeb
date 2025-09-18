import classNames from 'classnames';
import React, { KeyboardEvent, forwardRef } from 'react';

interface OrderQuantityInputProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: boolean;
    autoFocus?: boolean;
    min?: number;
    max?: number;
    placeholder?: string;
}

const OrderQuantityInput = forwardRef<
    HTMLInputElement,
    OrderQuantityInputProps
>(
    (
        {
            value,
            onChange,
            onKeyDown,
            disabled = false,
            error = false,
            autoFocus = false,
            min = 1,
            max,
            placeholder = '0',
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            // Allow empty string for clearing
            if (newValue === '') {
                onChange(undefined);
                return;
            }

            // Parse and validate number
            const numValue = parseInt(newValue, 10);
            if (!isNaN(numValue)) {
                // Apply min/max constraints
                let constrainedValue = numValue;
                if (min !== undefined && numValue < min) {
                    constrainedValue = min;
                }
                if (max !== undefined && numValue > max) {
                    constrainedValue = max;
                }
                onChange(constrainedValue);
            }
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select();
        };

        const displayValue =
            value === undefined ? '' : value === 0 ? '0' : value.toString();

        // Dynamic font size based on number of digits
        const getFontSize = () => {
            const digitCount = displayValue.length;
            if (digitCount <= 2) return 'text-order-quantity'; // 32px for 1-2 digits
            if (digitCount === 3) return 'text-heading-2'; // 20px for 3 digits
            return 'text-button'; // 16px for 4+ digits
        };

        return (
            <input
                ref={ref}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                className={classNames(
                    'h-[80px] w-[80px] rounded-[8px] px-4',
                    'bg-primary-50',
                    `text-primary-900 text-center ${getFontSize()}`,
                    'focus:border-primary-500 focus:outline-none focus:ring-0',
                    'transition-all duration-300 ease-in-out',
                    `placeholder:${getFontSize().replace('text-', '')} placeholder:text-neutral-500`,
                    'disabled:border-primary-100 disabled:bg-primary-50 disabled:text-neutral-500',
                    'hover:border-primary-300',
                    error &&
                        'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                )}
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
                onKeyDown={onKeyDown}
                onFocus={handleFocus}
                disabled={disabled}
                autoFocus={autoFocus}
            />
        );
    }
);

OrderQuantityInput.displayName = 'OrderQuantityInput';

export default OrderQuantityInput;
