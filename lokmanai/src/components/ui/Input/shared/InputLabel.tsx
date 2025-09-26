// Input component'ında kullanılmak üzere label component'ı
import { InputLabelProps } from '@/@interfaces/input';
import classNames from 'classnames';
import React from 'react';

const InputLabel = ({ isError, isDisabled, ...props }: InputLabelProps) => {
    return (
        <label
            {...props}
            className={classNames(
                // base styles
                'h-fit w-fit',
                // font-size
                'text-input-label',
                // text-color
                { 'text-danger-500 dark:text-danger-100': isError },
                {
                    'text-primary-700 dark:!text-primary-50':
                        !isError && !isDisabled,
                },
                { 'text-primary-200 dark:text-primary-100': isDisabled }
            )}
        />
    );
};

export default InputLabel;
