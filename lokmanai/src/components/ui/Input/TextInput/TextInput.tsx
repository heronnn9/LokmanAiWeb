'use client';
import React, { forwardRef, useRef, useState } from 'react';
import classNames from 'classnames';
import { InputProps } from '@/@interfaces/input';
import InputLabel from '../shared/InputLabel';
import InputErrorMessage from '../shared/InputErrorMessage';
import copyToClipboard from '@/hooks/copyToClipboard';
import useToast from '@/hooks/useToast';
import usePriceInput from './hooks/usePriceInput';
import PasswordToggleButton from './components/PasswordToggleButton';
import RightIcon from './components/RightIcon';
import SuffixAndExtraContent from './components/SuffixAndExtraContent';
import { getInputClassNames } from './lib/styling';
import InputSkeleton from '../../Loading/Skeleton/InputSkeleton';

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            isError = false,
            errorMessage = '',
            isLoading = false,
            iconType,
            label = '',
            id,
            fullWidth = false,
            fullHeight = false,
            isLight = false,
            extraContent,
            suffix,
            priceInput = false,
            isBarcode = false,
            onIconClick,
            iconClassName,
            copyValue,
            ...props
        },
        ref
    ) => {
        const inputElRef = useRef<HTMLInputElement | null>(null);
        const setRefs = (node: HTMLInputElement | null) => {
            inputElRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref && 'current' in ref) {
                (
                    ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = node;
            }
        };

        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const { show } = useToast();
        const { displayValue, handleChange } = usePriceInput(
            props.value,
            priceInput,
            props.onChange,
            inputElRef
        );

        const handleCopy = () => {
            const isCopied = copyToClipboard(props.value?.toString() || '');
            if (isCopied) {
                show({
                    message: 'Başarıyla panoya kopyalandı',
                    type: 'success',
                    duration: 2000,
                });
            }
        };

        if (isLoading) {
            return <InputSkeleton />;
        }

        const inputClassName = getInputClassNames(
            { ...props, id },
            isError,
            isLight,
            iconType,
            suffix,
            extraContent,
            isBarcode,
            fullHeight
        );

        return (
            <div
                className={classNames(
                    'flex flex-col gap-2',
                    fullHeight && 'h-full'
                )}
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
                        { 'w-full': fullWidth },
                        { 'lg:min-w-[300px]': !fullWidth },
                        { 'h-full': fullHeight }
                    )}
                >
                    <RightIcon
                        iconType={iconType}
                        onIconClick={onIconClick}
                        copyValue={copyValue}
                        handleCopy={handleCopy}
                        iconClassName={iconClassName}
                    />
                    <input
                        {...props}
                        ref={setRefs}
                        id={id}
                        onChange={handleChange}
                        value={priceInput ? displayValue : props.value}
                        className={inputClassName}
                        type={
                            props.type === 'password'
                                ? isPasswordVisible
                                    ? 'text'
                                    : 'password'
                                : props.type
                        }
                    />
                    {props.type === 'password' && !extraContent && (
                        <PasswordToggleButton
                            isVisible={isPasswordVisible}
                            onToggle={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                            }
                            isError={isError}
                        />
                    )}
                    <SuffixAndExtraContent
                        suffix={suffix}
                        extraContent={extraContent}
                        disabled={props.disabled}
                        isError={isError}
                    />
                </div>
                {isError && <InputErrorMessage errorMessage={errorMessage} />}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
