import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { forwardRef, useState } from 'react';
import Icon from '../../Icon';

type MonthPickerProps = {
    value?: Date | null;
    onChange: (date: Date | null) => void;
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

const MonthPicker = ({
    value,
    onChange,
    placeholder = 'Ay Seçiniz',
    inputSize = 'md',
    minDate,
    maxDate,
    disabled = false,
    required = false,
    name = 'monthPicker',
    id = 'monthPicker',
    label = '',
    isError = false,
    errorMessage = '',
}: MonthPickerProps) => {
    const [currentYear, setCurrentYear] = useState(
        value ? value.getFullYear() : new Date().getFullYear()
    );

    // Size-specific classes and styles
    const getSizeClasses = () => {
        switch (inputSize) {
            case 'sm':
                return {
                    container: 'month-picker-input-sm',
                    icon: 16,
                    inputClass: 'h-[40px] px-3 text-sm w-[160px] rounded-[4px]',
                    calendarClass: 'w-[280px] p-4',
                    monthClass: 'px-3 py-2 text-xs',
                };
            case 'lg':
                return {
                    container: 'month-picker-input-lg',
                    icon: 20,
                    inputClass:
                        'h-[56px] px-4 text-base w-[220px] rounded-[4px]',
                    calendarClass: 'w-[320px] p-6',
                    monthClass: 'px-4 py-3 text-base',
                };
            default: // md
                return {
                    container: 'month-picker-input-md',
                    icon: 18,
                    inputClass: 'h-[48px] px-3 text-sm w-[184px] rounded-[4px]',
                    calendarClass: 'w-[300px] p-5',
                    monthClass: 'px-3 py-2 text-sm',
                };
        }
    };

    const sizeClasses = getSizeClasses();

    // Format display value
    const getDisplayValue = () => {
        if (!value) return '';
        return format(value, 'MMMM yyyy', { locale: tr });
    };

    const handleMonthClick = (month: number, close: () => void) => {
        const newDate = new Date(currentYear, month, 1);

        // Check if date is within bounds
        if (minDate && newDate < minDate) return;
        if (maxDate && newDate > maxDate) return;

        onChange(newDate);
        close();
    };

    const isMonthDisabled = (month: number) => {
        const testDate = new Date(currentYear, month, 1);
        if (minDate && testDate < minDate) return true;
        if (maxDate && testDate > maxDate) return true;
        return false;
    };

    const isSelectedMonth = (month: number) => {
        if (!value) return false;
        return (
            value.getMonth() === month && value.getFullYear() === currentYear
        );
    };

    const months = [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
    ];

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
                    'relative rounded-[4px] border border-neutral-200 bg-primary-50',
                    sizeClasses.inputClass,
                    'transition-colors focus-within:border-primary-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary-500 hover:border-neutral-300',
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
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <Icon
                        icon="calendar"
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
                <div className="mt-1 text-xs text-danger-500">
                    {errorMessage}
                </div>
            )}
        </div>
    ));

    CustomInput.displayName = 'CustomInput';

    return (
        <Popover className="relative">
            {({ close }) => (
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
                            {/* Year Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    onClick={() =>
                                        setCurrentYear(currentYear - 1)
                                    }
                                    className="rounded p-2 hover:bg-neutral-100"
                                    type="button"
                                >
                                    <Icon
                                        icon="arrow-left"
                                        size={16}
                                        color="#001732"
                                    />
                                </button>
                                <div className="font-gotham text-heading-5 text-primary-700">
                                    {currentYear}
                                </div>
                                <button
                                    onClick={() =>
                                        setCurrentYear(currentYear + 1)
                                    }
                                    className="rounded p-2 hover:bg-neutral-100"
                                    type="button"
                                >
                                    <Icon
                                        icon="arrow-right"
                                        size={16}
                                        color="#001732"
                                    />
                                </button>
                            </div>

                            {/* Months grid */}
                            <div className="grid grid-cols-3 gap-2">
                                {months.map((month, index) => {
                                    const isSelected = isSelectedMonth(index);
                                    const isDisabled = isMonthDisabled(index);

                                    return (
                                        <button
                                            key={month}
                                            onClick={() =>
                                                !isDisabled &&
                                                handleMonthClick(index, close)
                                            }
                                            disabled={isDisabled}
                                            className={classNames(
                                                sizeClasses.monthClass,
                                                'rounded font-gotham transition-colors',
                                                {
                                                    'bg-primary-700 text-white':
                                                        isSelected,
                                                    'text-neutral-900 hover:bg-primary-100':
                                                        !isDisabled &&
                                                        !isSelected,
                                                    'cursor-not-allowed text-neutral-400 opacity-50':
                                                        isDisabled,
                                                    'cursor-pointer':
                                                        !isDisabled,
                                                }
                                            )}
                                        >
                                            {month}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Clear button */}
                            {value && (
                                <div className="mt-2 border-t border-neutral-100 pt-2">
                                    <button
                                        onClick={() => {
                                            onChange(null);
                                            close();
                                        }}
                                        className="w-full py-1 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                                        type="button"
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

export default MonthPicker;
