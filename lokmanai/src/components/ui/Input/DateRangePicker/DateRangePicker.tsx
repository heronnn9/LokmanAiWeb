import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import {
    addDays,
    format,
    isAfter,
    isBefore,
    isSameDay,
    startOfDay,
} from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { forwardRef, useState } from 'react';
import Icon from '../../Icon';

type DateRangePickerProps = {
    startDate?: Date | null;
    endDate?: Date | null;
    onChange: (startDate: Date | null, endDate: Date | null) => void;
    placeholder?: string;
    inputSize?: 'sm' | 'md' | 'lg';
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
    label?: string;
    isError?: boolean;
    errorMessage?: string;
};

const DateRangePicker = ({
    startDate,
    endDate,
    onChange,
    placeholder = 'Tarih Seçiniz',
    inputSize = 'md',
    minDate,
    maxDate = new Date(),
    disabled = false,
    //readOnly = false,
    required = false,
    name = 'dateRange',
    id = 'dateRange',
    label = '',
    isError = false,
    errorMessage = '',
}: DateRangePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Size-specific classes and styles
    const getSizeClasses = () => {
        switch (inputSize) {
            case 'sm':
                return {
                    container: 'date-range-input-sm',
                    icon: 16,
                    inputClass: 'h-[40px] px-3 text-sm w-[160px] rounded-[4px]',
                    calendarClass: 'w-[280px] p-4',
                    dayClass: 'w-8 h-8 text-xs',
                };
            case 'lg':
                return {
                    container: 'date-range-input-lg',
                    icon: 20,
                    inputClass:
                        'h-[56px] px-4 text-base w-[220px] rounded-[4px]',
                    calendarClass: 'w-[320px] p-6',
                    dayClass: 'w-10 h-10 text-base',
                };
            default: // md
                return {
                    container: 'date-range-input-md',
                    icon: 18,
                    inputClass: 'h-[48px] px-3 text-sm w-[184px] rounded-[4px]',
                    calendarClass: 'w-[300px] p-5',
                    dayClass: 'w-9 h-9 text-sm',
                };
        }
    };

    const sizeClasses = getSizeClasses();

    // Format display value
    const getDisplayValue = () => {
        if (!startDate) return '';
        if (endDate) {
            const today = startOfDay(new Date());
            if (isSameDay(endDate, today)) {
                const diffDays =
                    Math.abs(
                        Math.ceil(
                            (endDate.getTime() - startDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                        )
                    ) + 1;
                return `Son ${diffDays} gün`;
            }
            return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
        }

        const today = startOfDay(new Date());
        const diffDays = Math.ceil(
            (today.getTime() - startOfDay(startDate).getTime()) /
                (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) return 'Bugün';
        if (diffDays === 1) return 'Dün';
        if (diffDays === 2) return '2 gün önce';
        if (diffDays === 3) return '3 gün önce';
        if (diffDays === 7) return '1 hafta önce';
        if (diffDays === 30) return '1 ay önce';

        return format(startDate, 'dd/MM/yyyy');
    };

    const handleDateClick = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            // Start new selection
            onChange(date, null);
        } else {
            // Complete selection
            if (isAfter(date, startDate)) {
                onChange(startDate, date);
            } else {
                onChange(date, startDate);
            }
        }
    };

    const isInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return isAfter(date, startDate) && isBefore(date, endDate);
    };

    const isStartDate = (date: Date) => {
        return startDate && isSameDay(date, startDate);
    };

    const isEndDate = (date: Date) => {
        return endDate && isSameDay(date, endDate);
    };

    const isDisabled = (date: Date) => {
        if (minDate && isBefore(date, minDate)) return true;
        if (maxDate && isAfter(date, maxDate)) return true;
        return false;
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add previous month days
        const firstDayOfWeek = firstDay.getDay();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(addDays(firstDay, -i - 1));
        }

        // Add current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        // Add next month days
        const lastDayOfWeek = lastDay.getDay();
        for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
            days.push(addDays(lastDay, i));
        }

        return days;
    };

    const CustomInput = forwardRef<
        HTMLDivElement,
        {
            value?: string;
            onClick?: () => void;
        }
    >(({ value, onClick }, ref) => (
        <div
            className={classNames('relative', sizeClasses.container)}
            ref={ref}
        >
            <div
                className={classNames(
                    'relative rounded-[4px] border border-neutral-200 bg-white',
                    sizeClasses.inputClass,
                    'focus-within:border-primary-500 focus-within:ring-primary-500 transition-colors focus-within:ring-1 hover:border-neutral-300',
                    isError &&
                        'border-danger-500 focus-within:border-danger-500 focus-within:ring-danger-500',
                    disabled && 'cursor-not-allowed opacity-50'
                )}
                style={{
                    width:
                        inputSize === 'sm'
                            ? '160px'
                            : inputSize === 'lg'
                              ? '220px'
                              : '184px',
                    height:
                        inputSize === 'sm'
                            ? '40px'
                            : inputSize === 'lg'
                              ? '56px'
                              : '48px',
                }}
            >
                <input
                    id={id}
                    name={name}
                    value={value || ''}
                    onClick={onClick}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={true}
                    required={required}
                    className="h-full w-full border-none bg-transparent pr-10 text-left text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
                />
                <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                    <Icon
                        icon="calendar"
                        className="dark:brightness-0 dark:invert"
                        color="#001732"
                        size={sizeClasses.icon}
                    />
                </div>
            </div>
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-xs text-neutral-600"
                >
                    {label}
                </label>
            )}
            {isError && errorMessage && (
                <div className="text-danger-500 mt-1 text-xs">
                    {errorMessage}
                </div>
            )}
        </div>
    ));

    CustomInput.displayName = 'CustomInput';

    const days = getDaysInMonth(currentMonth);

    return (
        <Popover className="relative">
            {(
                {
                    /* open */
                }
            ) => (
                <>
                    <Popover.Button
                        as={CustomInput}
                        value={getDisplayValue()}
                    />

                    <Popover.Panel className="absolute z-50 mt-2">
                        <div
                            className={classNames(
                                'rounded-lg border border-neutral-100 bg-white shadow-lg',
                                sizeClasses.calendarClass
                            )}
                        >
                            {/* Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    onClick={() =>
                                        setCurrentMonth(
                                            new Date(
                                                currentMonth.getFullYear(),
                                                currentMonth.getMonth() - 1
                                            )
                                        )
                                    }
                                    className="rounded p-2 hover:bg-neutral-100"
                                >
                                    <Icon
                                        icon="arrow-left"
                                        className="dark:brightness-0 dark:invert"
                                        size={16}
                                        color="#001732"
                                    />
                                </button>
                                <div className="font-gotham text-heading-5 text-primary-700">
                                    {format(currentMonth, 'MMMM yyyy', {
                                        locale: tr,
                                    })}
                                </div>
                                <button
                                    onClick={() =>
                                        setCurrentMonth(
                                            new Date(
                                                currentMonth.getFullYear(),
                                                currentMonth.getMonth() + 1
                                            )
                                        )
                                    }
                                    className="rounded p-2 hover:bg-neutral-100"
                                >
                                    <Icon
                                        icon="arrow-right"
                                        className="dark:brightness-0 dark:invert"
                                        size={16}
                                        color="#001732"
                                    />
                                </button>
                            </div>

                            {/* Days of week */}
                            <div className="mb-2 grid grid-cols-7 gap-1">
                                {[
                                    'Pzt',
                                    'Sal',
                                    'Çar',
                                    'Per',
                                    'Cum',
                                    'Cmt',
                                    'Paz',
                                ].map((day) => (
                                    <div
                                        key={day}
                                        className="py-1 text-center text-xs text-neutral-500"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day, index) => {
                                    const isCurrentMonth =
                                        day.getMonth() ===
                                        currentMonth.getMonth();
                                    const isSelected =
                                        isStartDate(day) || isEndDate(day);
                                    const isInRangeSelected = isInRange(day);
                                    const isDisabledDay = isDisabled(day);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDateClick(day)}
                                            disabled={isDisabledDay}
                                            className={classNames(
                                                sizeClasses.dayClass,
                                                'flex items-center justify-center rounded transition-colors',
                                                {
                                                    'text-neutral-400':
                                                        !isCurrentMonth,
                                                    'text-neutral-900':
                                                        isCurrentMonth &&
                                                        !isSelected &&
                                                        !isInRangeSelected,
                                                    'bg-primary-50 text-primary-700':
                                                        isInRangeSelected,
                                                    'bg-primary-700 text-white':
                                                        isSelected,
                                                    'hover:bg-primary-100':
                                                        !isDisabledDay &&
                                                        !isSelected,
                                                    'cursor-not-allowed opacity-50':
                                                        isDisabledDay,
                                                    'cursor-pointer':
                                                        !isDisabledDay,
                                                }
                                            )}
                                        >
                                            {day.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Clear button */}
                            {(startDate || endDate) && (
                                <div className="mt-4 border-t border-neutral-100 pt-4">
                                    <button
                                        onClick={() => {
                                            onChange(null, null);
                                        }}
                                        className="w-full py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                                    >
                                        Temizle
                                    </button>
                                </div>
                            )}
                        </div>
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );
};

export default DateRangePicker;
