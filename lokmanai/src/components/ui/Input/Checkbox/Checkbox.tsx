// Checkbox component
// Kullanılan kütüphane: https://www.npmjs.com/package/react-switch
import { CheckboxProps } from '@/@interfaces/input';
import classNames from 'classnames';
import React from 'react';
import Icon from '../../Icon';
import InputErrorMessage from '../shared/InputErrorMessage';
import { BORDER_RADIUS_SM } from '@/constants/theme.constants';

const Checkbox = React.forwardRef<
    HTMLInputElement,
    CheckboxProps & { name?: string; amount?: number; labelNoWrap?: boolean }
>(
    (
        {
            id,
            label,
            isError,
            errorMessage,
            disabled,
            isFilter = false,
            amount,
            labelNoWrap = false,
            ...props
        },
        ref
    ) => {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <input
                        {...props}
                        ref={ref}
                        type="checkbox"
                        id={id}
                        disabled={disabled}
                        className={classNames(
                            'peer border-primary-500 checked:bg-primary-500 disabled:border-primary-100 relative h-[20px] w-[20px] shrink-0 appearance-none border bg-transparent disabled:bg-transparent',
                            BORDER_RADIUS_SM,
                            { 'ring-primary-500': !props.checked }
                        )}
                    />
                    <label
                        htmlFor={id}
                        className={classNames(
                            isFilter
                                ? 'font-narrow text-filter leading-[24px]'
                                : 'text-checkbox',
                            disabled ? 'text-primary-200' : 'text-primary-700',
                            '-mt-[1px] text-start'
                        )}
                    >
                        <div className="inline space-x-1">
                            <span
                                className={classNames(
                                    'inline',
                                    labelNoWrap && 'whitespace-nowrap'
                                )}
                            >
                                {label}
                            </span>
                            {amount && !disabled ? (
                                <p className="font-narrow-350 bg-primary-50 text-label text-primary-300 inline-flex w-fit items-center rounded px-2">
                                    {amount}
                                </p>
                            ) : null}
                        </div>
                    </label>
                    <div className="pointer-events-none absolute hidden h-fit w-fit peer-checked:block">
                        <Icon
                            icon="check"
                            className="dark:brightness-0 dark:invert"
                            color="#fff"
                            size={20}
                        />
                    </div>
                </div>
                {errorMessage && isError && (
                    <InputErrorMessage errorMessage={errorMessage} />
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
