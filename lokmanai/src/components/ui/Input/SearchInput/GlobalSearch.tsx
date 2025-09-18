// Search input component
'use client';
import { InputProps } from '@/@interfaces/input';
import GlobalSearchBox from '@/components/ui/Input/SearchInput/GlobalSearchBox/GlobalSearchBox';
import { BORDER_RADIUS_SM } from '@/constants/theme.constants';
import useDebounce from '@/hooks/useDebounce';
import { useGetGlobalSearchQuery } from '@/services/homeApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIsSearchModalOpen } from '@/store/slices/navSlice';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import Icon from '../../Icon';
import InputErrorMessage from '../shared/InputErrorMessage';
import InputLabel from '../shared/InputLabel';
interface GlobalSearchProps extends InputProps {
    onSearch?: (value: string) => void;
}

const GlobalSearch = ({
    isError = false,
    errorMessage = '',
    label = '',
    id,
    ...props
}: GlobalSearchProps) => {
    const router = useRouter();
    const [value, setValue] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { isSearchModalOpen } = useAppSelector((state) => state.nav);
    const debouncedSearchValue = useDebounce(value, 300);
    const searchBoxRef = useRef<HTMLDivElement>(null);

    const { data: searchData, isFetching } = useGetGlobalSearchQuery(
        debouncedSearchValue,
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
            skip: !debouncedSearchValue || debouncedSearchValue.length < 3,
        }
    );

    const showSearchResults =
        isSearchFocused &&
        isSearchModalOpen &&
        searchData &&
        debouncedSearchValue.length >= 3;
    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBoxRef.current &&
                !searchBoxRef.current.contains(event.target as Node)
            ) {
                handleCloseSearch();
            }
        };

        if (isSearchModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearchModalOpen]);

    // Add cleanup effect
    useEffect(() => {
        return () => {
            setIsSearchFocused(false);
            dispatch(setIsSearchModalOpen(false));
        };
    }, [dispatch]);

    const handleCloseSearch = () => {
        setIsSearchFocused(false);
        dispatch(setIsSearchModalOpen(false));
        setValue('');
        inputRef.current?.blur();
    };

    const handleSearchNavigate = (value: string) => {
        if (value.length >= 3) {
            router.push(`/ara?q=${value}`);
            handleCloseSearch();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (newValue.length >= 3) {
            setIsSearchFocused(true);
            dispatch(setIsSearchModalOpen(true));
        } else {
            setIsSearchFocused(false);
            dispatch(setIsSearchModalOpen(false));
        }
    };

    const handleInputFocus = () => {
        if (value.length >= 3) {
            setIsSearchFocused(true);
            dispatch(setIsSearchModalOpen(true));
        }
    };

    return (
        <div
            ref={searchBoxRef}
            className="flex flex-col gap-2"
        >
            {label && (
                <InputLabel
                    htmlFor={id}
                    isError={isError}
                    isDisabled={props.disabled}
                >
                    {label}
                </InputLabel>
            )}
            <div
                className={classNames(
                    'relative inline-flex w-full items-center lg:min-w-[418px]'
                )}
            >
                <input
                    {...props}
                    ref={inputRef}
                    id={id}
                    type="text"
                    autoComplete="off"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={() => {
                        // Small delay to allow clicking on search results
                        setTimeout(() => {
                            if (value.length < 3) {
                                handleCloseSearch();
                            }
                        }, 200);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchNavigate(value);
                        }
                    }}
                    className={classNames(
                        'font-narrow text-input h-10 w-full appearance-none focus:outline-none',
                        'bg-primary-50 text-filter placeholder:text-filter border-none',
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
                {typeof value === 'string' && value.length === 0 && (
                    <div className="absolute right-4">
                        <Icon
                            className="dark:brightness-0 dark:invert"
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
                            setValue('');
                            setIsSearchFocused(false);
                            dispatch(setIsSearchModalOpen(false));
                        }}
                    >
                        <Icon
                            className="dark:brightness-0 dark:invert"
                            icon="x"
                            color="#001732"
                        />
                    </button>
                )}
            </div>
            {/* Search Box */}
            {showSearchResults && (
                <div className="absolute top-[128px] z-50 xl:top-[68px]">
                    <GlobalSearchBox
                        data={searchData}
                        value={value}
                        setValue={setValue}
                        handleCloseSearch={handleCloseSearch}
                        isLoading={isFetching}
                    />
                </div>
            )}
            {isError && <InputErrorMessage errorMessage={errorMessage} />}
        </div>
    );
};

export default GlobalSearch;
