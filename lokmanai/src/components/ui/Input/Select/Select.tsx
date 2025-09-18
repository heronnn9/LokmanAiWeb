'use client';

import { SelectProps } from '@/@interfaces/input';
import { BORDER_RADIUS_SM } from '@/constants/theme.constant';
import classNames from 'classnames';
import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useLayoutEffect,
} from 'react';
import Icon from '../../Icon';
import InputLabel from '../shared/InputLabel';
import Option from './Option';
import _ from 'lodash';
import useToast from '@/hooks/useToast';
import copyToClipboard from '@/hooks/copyToClipboard';

const Select = forwardRef<HTMLInputElement, SelectProps>(
    (
        {
            label,
            value = null,
            isError,
            options,
            onSelectOption,
            fullWidth = false,
            placeholder,
            isLight = false,
            isFilter = false,
            required = false,
            className,
            onChange,
            name,
            isBarcode = false,
            noMinWidth = false,
            onIconClick,
            iconClassName,
            iconType,
            copyFromLabel,
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef<HTMLDivElement>(null);
        const buttonRef = useRef<HTMLButtonElement>(null);
        const { show } = useToast();
        const handleCopy = () => {
            const isCopied = copyToClipboard(value?.toString() || '');
            if (isCopied) {
                show({
                    message: 'Başarıyla panoya kopyalandı',
                    type: 'success',
                    duration: 2000,
                });
            }
        };

        // Find the display name for the current value
        const displayName =
            value != null && value !== ''
                ? options.find((opt) => String(opt.value) === String(value))
                      ?.name || placeholder
                : placeholder;

        const [truncatedDisplayName, setTruncatedDisplayName] =
            useState(displayName);

        useLayoutEffect(() => {
            const updateTruncation = () => {
                if (!buttonRef.current || !displayName) {
                    setTruncatedDisplayName(displayName);
                    return;
                }

                // Constants for calculation
                const PADDING_HORIZONTAL = 32; // pl-4 pr-4 -> 16 + 16
                const ARROW_ICON_WIDTH = 24;
                const TRASH_ICON_WIDTH = onIconClick ? 24 : 0;
                const ICON_GAP = onIconClick ? 8 : 0; // Gap between icons
                const AVG_CHAR_WIDTH = 8.5; // Heuristic average character width

                const buttonWidth = buttonRef.current.clientWidth;
                const availableWidth =
                    buttonWidth -
                    PADDING_HORIZONTAL -
                    ARROW_ICON_WIDTH -
                    TRASH_ICON_WIDTH -
                    ICON_GAP;
                const maxLength = Math.floor(availableWidth / AVG_CHAR_WIDTH);

                if (displayName.length > maxLength && maxLength > 3) {
                    setTruncatedDisplayName(
                        _.truncate(displayName, { length: maxLength })
                    );
                } else {
                    setTruncatedDisplayName(displayName);
                }
            };

            updateTruncation(); // Initial truncation

            // Observe the button for size changes
            const resizeObserver = new ResizeObserver(updateTruncation);
            if (buttonRef.current) {
                resizeObserver.observe(buttonRef.current);
            }

            return () => {
                if (buttonRef.current) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    resizeObserver.unobserve(buttonRef.current);
                }
            };
        }, [displayName, onIconClick]);

        // Handle outside clicks to close dropdown
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    selectRef.current &&
                    !selectRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () =>
                document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        // Handle option selection
        const handleSelectOption = (
            optionValue: string | number | null,
            optionName: string
        ) => {
            setIsOpen(false);

            if (onSelectOption) {
                onSelectOption(optionValue, optionName);
            }

            if (onChange) {
                const event = {
                    target: {
                        name: name || label,
                        value: optionValue,
                    },
                };
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                onChange(event as any);
            }
        };

        return (
            <div className="flex w-full flex-col gap-2">
                {label && (
                    <div className="flex items-center gap-2">
                        <InputLabel
                            isError={isError}
                            isDisabled={props.disabled}
                        >
                            {label}{' '}
                            {required && (
                                <span className="text-filter">(Zorunlu)</span>
                            )}
                        </InputLabel>
                        {copyFromLabel && (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={classNames(iconClassName)}
                            >
                                <Icon
                                    className="dark:brightness-0 dark:invert"
                                    icon="copy"
                                    size={20}
                                    color="#001732"
                                />
                            </button>
                        )}
                    </div>
                )}
                <div
                    className={classNames(
                        'relative inline-flex items-center',
                        { 'w-full': fullWidth },
                        !noMinWidth && 'w-[184px] min-w-[184px]'
                    )}
                    ref={selectRef}
                >
                    <input
                        type="hidden"
                        name={name || label}
                        value={value?.toString() || ''}
                        ref={ref}
                    />
                    <span
                        className={classNames(
                            'pointer-events-none absolute inset-y-0 right-2.5 z-10 ml-3 flex items-center pr-2'
                        )}
                    >
                        <Icon
                            icon={isOpen ? 'arrow-up' : 'arrow-down'}
                            size={24}
                            className="dark:brightness-0 dark:invert"
                            color="#001732"
                        />
                    </span>
                    {onIconClick && (
                        <button
                            type="button"
                            onClick={onIconClick}
                            className={classNames(
                                'absolute right-12 z-20',
                                iconClassName
                            )}
                        >
                            <Icon
                                className="dark:brightness-0 dark:invert"
                                icon={iconType || 'trash'}
                                size={24}
                                color="#FF0000"
                            />
                        </button>
                    )}
                    <button
                        type="button"
                        ref={buttonRef}
                        disabled={
                            props.disabled ||
                            (props.id === 'product-barcode' &&
                                options.length < 2)
                        }
                        className={classNames(
                            className,
                            isOpen
                                ? 'relative w-full cursor-default text-left outline-none'
                                : 'relative w-full cursor-default text-left',
                            'w-fit appearance-none focus:outline-none',
                            !noMinWidth && 'lg:min-w-[184px]',
                            'h-[48px]',
                            // Background color
                            {
                                'bg-primary-50':
                                    !isError && !props.disabled && !isLight,
                            },

                            props.disabled &&
                                `cursor-not-allowed ${isLight ? 'bg-neutral-0' : 'bg-primary-50'} opacity-50`,
                            { 'bg-danger-50': isError },
                            { 'bg-neutral-0': isLight },

                            // Border
                            'border-[1px]',
                            // Border color based on state
                            { 'border-none': props.disabled },
                            {
                                'border-neutral-100':
                                    !isError && !props.disabled,
                            },
                            { 'border-danger-500': isError },
                            // Border radius
                            BORDER_RADIUS_SM,
                            // Text color
                            'placeholder:text-input-placeholder placeholder:text-primary-300 placeholder:opacity-50',
                            { 'text-neutral-100': props.disabled },
                            { 'text-danger-500': isError },
                            {
                                'text-input-placeholder text-primary-100':
                                    value == null || value === '',
                            },
                            {
                                'text-button-light text-primary-500':
                                    value != null && value !== '',
                            },
                            {
                                'text-button-sm-light text-primary-500':
                                    isFilter,
                            },
                            // Padding
                            'pr-12 pl-4',
                            { 'pr-20': onIconClick },
                            // Focus state
                            !isError &&
                                !props.disabled &&
                                'focus:bg-neutral-0 focus:text-primary-500 focus:ring-[1px] focus:ring-neutral-500',
                            {
                                'focus:ring-danger-500 focus:ring-[1px]':
                                    isError,
                            },
                            'transition-all duration-300 ease-in-out'
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        }}
                    >
                        <div className="flex items-center">
                            <span
                                className={classNames(
                                    'block truncate text-sm',
                                    isBarcode && 'text-sm'
                                )}
                            >
                                {truncatedDisplayName}
                            </span>
                        </div>
                    </button>
                    {isOpen && (
                        <div
                            className={classNames(
                                'bg-neutral-0 absolute top-[64px] left-0 z-50 w-full min-w-fit rounded-[4px]',
                                fullWidth && 'lg:max-w-[450px]',
                                isFilter ? '!top-[56px]' : '!top-[64px]'
                            )}
                        >
                            <ul className="max-h-56 overflow-auto rounded-[4px] border-[1px] border-neutral-100">
                                {options.map((option) => (
                                    <Option
                                        key={option.id}
                                        isFilter={isFilter}
                                        value={option.value}
                                        active={
                                            value != null &&
                                            value !== '' &&
                                            String(value) ===
                                                String(option.value)
                                        }
                                        updateValue={handleSelectOption}
                                        id={option.id}
                                        name={option.name}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
