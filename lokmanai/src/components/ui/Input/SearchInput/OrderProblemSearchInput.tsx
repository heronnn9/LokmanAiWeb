// Search input component
'use client';
import { InputProps } from '@/@interfaces/input';
import { IOrderSP } from '@/@interfaces/models/orderProblem';
import { BORDER_RADIUS_SM } from '@/constants/theme.constant';
import classNames from 'classnames';
import { useState } from 'react';
import Icon from '../../Icon';
import InputErrorMessage from '../shared/InputErrorMessage';
import InputLabel from '../shared/InputLabel';
import OrderProblemProductSearchBox from './OrderProblemProductSearchBox';

interface SearchInputProps extends InputProps {
    onSearch?: (value: string) => void;
    onClear?: () => void;
    isFilterInput?: boolean;
    className?: string;
    fullWidth?: boolean;
    isLight?: boolean;
    isProductSearch?: boolean;
    productSearchResults?: Partial<IOrderSP>[];
    isLoading?: boolean;
    onSelectProduct: (product: IOrderSP) => void;
    showResultsOnFocus?: boolean;
}

const OrderProblemSearchInput = ({
    isError = false,
    errorMessage = '',
    label = '',
    id,
    isFilterInput = false,
    isLight = false,
    value = '',
    onChange,
    onClear,
    className,
    fullWidth = false,
    isProductSearch = false,
    productSearchResults = [],
    isLoading = false,
    onSelectProduct,
    showResultsOnFocus = false,
    ...props
}: SearchInputProps) => {
    const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);

    const handleProductSelect = (product: IOrderSP) => {
        setIsSearchBoxOpen(false);
        onSelectProduct(product);
    };

    return (
        <div
            className="flex flex-col gap-2"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsSearchBoxOpen(false);
                }
            }}
        >
            {label && (
                <InputLabel
                    htmlFor={id}
                    isError={isError}
                    isDisabled={props.disabled}
                >
                    {label}{' '}
                    {props.required && (
                        <span className="text-filter">(Zorunlu)</span>
                    )}
                </InputLabel>
            )}
            <div
                className={classNames(
                    'relative inline-flex w-full items-center',
                    { 'lg:min-w-[418px]': !isFilterInput },
                    { 'w-full': fullWidth }
                )}
            >
                <input
                    id={id}
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange?.(e);
                        setIsSearchBoxOpen(true);
                    }}
                    onFocus={() => {
                        if (showResultsOnFocus) {
                            setIsSearchBoxOpen(true);
                        }
                    }}
                    readOnly={!onChange}
                    {...props}
                    className={classNames(
                        className,
                        'font-narrow text-input h-10 w-full appearance-none focus:outline-none',
                        'text-filter placeholder:text-filter border-none',
                        isLight ? 'bg-neutral-0' : 'bg-primary-50',
                        'placeholder:text-primary-300 placeholder:opacity-50',
                        'pr-12 pl-4 transition-all duration-300 ease-in-out',
                        { 'bg-danger-50': isError },
                        { 'text-danger-500': isError },
                        { 'text-primary-700': !isError },
                        { 'focus:ring-[1px] focus:ring-neutral-500': !isError },
                        BORDER_RADIUS_SM
                    )}
                />
                {/* Search Icon */}
                {((typeof value === 'string' && value.length === 0) ||
                    !value) && (
                    <div className="absolute right-4">
                        <Icon
                            icon="search"
                            className="dark:brightness-0 dark:invert"
                            color="#001732"
                        />
                    </div>
                )}
                {/* Clear Button */}
                {typeof value === 'string' && value.length > 0 && (
                    <button
                        id="clear-button"
                        type="button"
                        className="absolute right-4"
                        onClick={() => {
                            onClear?.();
                            setIsSearchBoxOpen(false);
                        }}
                    >
                        <Icon
                            icon="x"
                            className="dark:brightness-0 dark:invert"
                            color="#001732"
                        />
                    </button>
                )}
                {isProductSearch &&
                    isSearchBoxOpen &&
                    (showResultsOnFocus ||
                        (typeof value === 'string' && value.length > 0)) && (
                        <OrderProblemProductSearchBox
                            results={productSearchResults}
                            searchText={value as string}
                            isLoading={isLoading}
                            onSelectProduct={handleProductSelect}
                        />
                    )}
            </div>

            {isError && <InputErrorMessage errorMessage={errorMessage} />}
        </div>
    );
};

export default OrderProblemSearchInput;
