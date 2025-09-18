import { InputErrorMessageProps } from '@/@interfaces/input';
import React from 'react';
import Icon from '../../Icon';

const InputErrorMessage = ({
    errorMessage,
    ...props
}: InputErrorMessageProps) => {
    return (
        <div
            {...props}
            aria-errormessage={errorMessage}
            className="inline-flex items-center gap-2"
        >
            <Icon
                icon="warning"
                color="#FF2B2B"
                size={16}
                className="dark:brightness-0 dark:invert"
            />
            <span className="text-info-small text-danger-500">
                {errorMessage}
            </span>
        </div>
    );
};

export default InputErrorMessage;
