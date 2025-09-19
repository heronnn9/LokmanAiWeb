// Quantity input component
import React from 'react';
import Icon from '../../Icon';
import InputLabel from '../shared/InputLabel';
import { QuantityInputProps } from '@/@interfaces/input';
import classNames from 'classnames';
import { BORDER_RADIUS_SM } from '@/constants/theme.constants';
import InputErrorMessage from '../shared/InputErrorMessage';
import Spinner from '../../Loading/Spinner/Spinner';

const QuantityInput = ({
    id,
    label,
    onChange,
    onButtonChange,
    onInputChange,
    value,
    isError,
    errorMessage,
    increaseDisabled,
    decreaseDisabled,
    isLoading,
    onBlur,
    ...props
}: QuantityInputProps) => {
    const handleIncrease = () => {
        if (isLoading || increaseDisabled) return;
        const newValue = (Number(value) || 0) + 1;
        // Öncelikle onButtonChange'i kullan, yoksa onChange'i kullan
        if (onButtonChange) {
            onButtonChange(newValue);
        } else {
            onChange(newValue);
        }
    };

    const handleDecrease = () => {
        if (isLoading || decreaseDisabled) return;
        const newValue = (Number(value) || 0) - 1;
        // Öncelikle onButtonChange'i kullan, yoksa onChange'i kullan
        if (onButtonChange) {
            onButtonChange(newValue);
        } else {
            onChange(newValue);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLoading) return;
        const rawValue = e.target.value;
        if (rawValue === '') {
            (onInputChange || onChange)('');
        } else {
            const newValue = parseInt(rawValue, 10);
            if (!isNaN(newValue) && newValue >= 0) {
                (onInputChange || onChange)(newValue);
            }
        }
    };

    const handleReset = () => {
        if (isLoading) return;
        // Reset işlemi de buton davranışı gibi düşünülebilir
        if (onButtonChange) {
            onButtonChange(undefined);
        } else {
            onChange(0);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <InputLabel
                    htmlFor={id}
                    isError={isError}
                    isDisabled={increaseDisabled || decreaseDisabled}
                >
                    {label}
                </InputLabel>
            )}
            <div
                className={classNames(
                    'relative inline-flex h-[40px] w-[96px] items-center justify-center gap-1',
                    // Border

                    'border-primary-300 border-[1px]',
                    { 'border-danger-500': isError },
                    // Border radius
                    BORDER_RADIUS_SM
                )}
            >
                {Number(value) > 1 ? (
                    <button
                        className={classNames({
                            'pointer-events-none opacity-50':
                                decreaseDisabled || isLoading,
                        })}
                        onClick={handleDecrease}
                    >
                        <Icon
                            icon="minus"
                            size={16}
                            color="#546A84"
                            className="dark:brightness-0 dark:invert"
                        />
                    </button>
                ) : (
                    <button
                        className={classNames({
                            'pointer-events-none opacity-50': isLoading,
                        })}
                        onClick={handleReset}
                    >
                        <Icon
                            icon="delete"
                            size={16}
                            color="#001732"
                            className="dark:brightness-0 dark:invert"
                        />
                    </button>
                )}
                {isLoading ? (
                    <div
                        id="spinner"
                        className="flex w-[44px] justify-center"
                    >
                        <Spinner
                            size="sm"
                            color="primary"
                        />
                    </div>
                ) : (
                    <input
                        {...props}
                        id={id}
                        type={'number'}
                        value={value}
                        onChange={handleChange}
                        onBlur={onBlur}
                        className={classNames(
                            // Base styles
                            'h-fit w-[44px] appearance-none focus:outline-none',
                            // Background color

                            'bg-transparent',
                            { 'bg-danger-50': isError },

                            // Border

                            'border-none',
                            { 'border-danger-500': isError },
                            // Border radius
                            BORDER_RADIUS_SM,
                            // Text color
                            'text-[#0D0D0D]',
                            { 'text-danger-500': isError },
                            // Font size
                            'text-input text-center',

                            // Focus state
                            !isError &&
                                'focus:bg-neutral-0 focus:text-primary-500 focus:ring-[1px] focus:ring-neutral-500',
                            {
                                'focus:ring-danger-500 focus:ring-[1px]':
                                    isError,
                            },
                            // Transition
                            'transition-all duration-300 ease-in-out'
                        )}
                    />
                )}
                <button
                    className={classNames({
                        'pointer-events-none opacity-50':
                            increaseDisabled || isLoading,
                    })}
                    onClick={handleIncrease}
                >
                    <Icon
                        icon="plus"
                        size={16}
                        color="#546A84"
                        className="dark:brightness-0 dark:invert"
                    />
                </button>
            </div>
            {isError && errorMessage && (
                <InputErrorMessage errorMessage={errorMessage} />
            )}
        </div>
    );
};

export default QuantityInput;
