import { InputProps } from '@/@interfaces/input';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { useState, forwardRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Icon from '../../Icon';
import Input from '../TextInput/TextInput';
import { DatePickerProps } from 'react-datepicker';
import classNames from 'classnames';

type ExpireDateInputProps = DatePickerProps &
    InputProps & {
        isExpireDate?: boolean;
        onNoExpireSelect?: () => void;
        isExpirationRequired?: boolean;
        mindate?: Date;
        inputSize?: 'sm' | 'md' | 'lg';
        readOnly?: boolean;
    };

interface CustomHeaderProps {
    date: Date;
    decreaseYear: () => void;
    increaseYear: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
}

const ExpireDateInput = ({
    isExpireDate = false,
    onNoExpireSelect,
    isExpirationRequired = false,
    mindate,
    ...props
}: ExpireDateInputProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Sync internal state with external value
    useEffect(() => {
        if (props.value) {
            const date = new Date(props.value);
            setSelectedDate(date);
        } else {
            setSelectedDate(null);
        }
    }, [props.value]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (props.onChange) {
            let formattedDate = '';
            if (date) {
                const utcDate = new Date(
                    Date.UTC(date.getFullYear(), date.getMonth(), 1)
                );
                formattedDate = utcDate.toISOString();
            }

            const event = {
                target: {
                    value: formattedDate,
                    name: props.name,
                },
            } as React.ChangeEvent<HTMLInputElement>;
            props.onChange(event);
        }
    };

    const handleNoExpireClick = () => {
        setSelectedDate(null);
        onNoExpireSelect?.();
        setIsOpen(false);
    };

    const CustomInput = forwardRef<
        HTMLDivElement,
        {
            value?: string;
            onClick?: () => void;
        }
    >(({ value, onClick }, ref) => (
        <div
            className="relative"
            ref={ref}
        >
            <Input
                {...props}
                value={value || props.placeholder}
                onClick={onClick}
                extraContent={
                    <button
                        type="button"
                        onClick={onClick}
                        className="flex cursor-pointer items-center"
                    >
                        <Icon
                            icon="calendar"
                            className="dark:brightness-0 dark:invert"
                            color="#001732"
                            size={24}
                        />
                    </button>
                }
            />
        </div>
    ));

    CustomInput.displayName = 'CustomInput';

    return (
        <div className="relative">
            <ReactDatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                customInput={<CustomInput />}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                locale={tr}
                open={isOpen}
                minDate={mindate}
                onClickOutside={() => setIsOpen(false)}
                onInputClick={() => setIsOpen(true)}
                renderCustomHeader={({
                    date,
                    decreaseYear,
                    increaseYear,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }: CustomHeaderProps) => (
                    <div className="flex items-center justify-between px-4 py-2">
                        <button
                            onClick={decreaseYear}
                            disabled={prevMonthButtonDisabled}
                            type="button"
                            aria-disabled={prevMonthButtonDisabled}
                            className={classNames(
                                'text-primary-500 hover:text-primary-700',
                                prevMonthButtonDisabled && 'opacity-50'
                            )}
                        >
                            <Icon
                                icon="arrow-left"
                                className="dark:brightness-0 dark:invert"
                                size={20}
                                color="#001732"
                            />
                        </button>
                        <div className="font-gotham text-heading-5 text-primary-700">
                            {format(date, 'yyyy')}
                        </div>
                        <button
                            onClick={increaseYear}
                            disabled={nextMonthButtonDisabled}
                            type="button"
                            className="text-primary-500 hover:text-primary-700"
                        >
                            <Icon
                                icon="arrow-right"
                                className="dark:brightness-0 dark:invert"
                                size={20}
                                color="#001732"
                            />
                        </button>
                    </div>
                )}
                calendarClassName="bg-neutral-0 shadow-lg border border-neutral-100"
                className={classNames('w-full')}
            >
                <div>
                    {isExpireDate && !isExpirationRequired && (
                        <button
                            type="button"
                            onClick={handleNoExpireClick}
                            className="font-gotham text-button text-primary-700 hover:bg-primary-50 w-full border-t border-neutral-100 pt-2 pb-1 text-center font-light"
                        >
                            Miatsız Ürün
                        </button>
                    )}
                </div>
            </ReactDatePicker>
        </div>
    );
};

export default ExpireDateInput;
