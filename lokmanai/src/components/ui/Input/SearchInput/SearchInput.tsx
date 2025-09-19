// Search input component
'use client';
import { InputProps } from '@/@interfaces/input';
import { ProductSearch } from '@/@interfaces/models/product';
import { BORDER_RADIUS_SM } from '@/constants/theme.constant';
import classNames from 'classnames';
import { useState } from 'react';
import Icon from '../../Icon';
import InputErrorMessage from '../shared/InputErrorMessage';
import InputLabel from '../shared/InputLabel';
import ProductSearchBox from './ProductSearchBox';

interface SearchInputProps extends InputProps {
    onSearch?: (value: string) => void;
    onClear?: () => void;
    isFilterInput?: boolean;
    className?: string;
    fullWidth?: boolean;
    isLight?: boolean;
    isProductSearch?: boolean;
    productSearchResults?: Partial<ProductSearch>[];
    isLoading?: boolean;
    onSelectProduct?: (product: ProductSearch) => void;
    onAddProduct?: () => void;
    isMultiSelect?: boolean;
    selectedProducts?: ProductSearch[];
    isNameTaken?: boolean;
}

const SearchInput = ({
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
    onAddProduct,
    isMultiSelect = false,
    selectedProducts = [],
    isNameTaken = false,
    ...props
}: SearchInputProps) => {
    const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);

    const handleProductSelect = (product: ProductSearch) => {
        if (isMultiSelect) {
            const isSelected = selectedProducts.some(
                (p) => p.productId === product.productId
            );
            onSelectProduct?.(product);
            if (!isSelected) {
                setIsSearchBoxOpen(true); // Keep search box open for multi-select
            }
        } else {
            setIsSearchBoxOpen(false);
            onSelectProduct?.(product);
        }
    };

    const handleAddProduct = () => {
        setIsSearchBoxOpen(false);
        onAddProduct?.();
    };

    return (
        <div className="flex flex-col gap-2">
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
                    readOnly={!onChange}
                    {...props}
                    className={classNames(
                        className,
                        'h-10 w-full appearance-none font-narrow text-input focus:outline-none',
                        'border-none text-filter placeholder:text-filter',
                        isLight ? 'bg-neutral-0' : 'bg-primary-50',
                        'placeholder:text-primary-300 placeholder:opacity-50',
                        'pl-4 pr-12 transition-all duration-300 ease-in-out',
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
                            color="#001732"
                        />
                    </button>
                )}
                {isProductSearch &&
                    value.toString().length > 0 &&
                    isSearchBoxOpen && (
                        <ProductSearchBox
                            results={productSearchResults}
                            searchText={value as string}
                            isLoading={isLoading}
                            onSelectProduct={handleProductSelect}
                            onAddProduct={
                                onAddProduct ? handleAddProduct : undefined
                            }
                            isMultiSelect={isMultiSelect}
                            selectedProducts={selectedProducts}
                            isNameTaken={isNameTaken}
                        />
                    )}
            </div>

            {isError && <InputErrorMessage errorMessage={errorMessage} />}
        </div>
    );
};

export default SearchInput;
