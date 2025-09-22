// Textarea component
import { TextAreaProps } from '@/@interfaces/input';
import { BORDER_RADIUS_SM } from '@/constants/theme.constants';
import classNames from 'classnames';
import InputErrorMessage from '../shared/InputErrorMessage';
import InputLabel from '../shared/InputLabel';
import InputSkeleton from '../../Loading/Skeleton/InputSkeleton';
import { forwardRef } from 'react';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            isError = false,
            errorMessage = '',
            label = '',
            id,
            isNegativeExperience = false,
            className,
            isLoading = false,
            isLight = false,
            ...props
        },
        ref
    ) => {
        if (isLoading) {
            return <InputSkeleton />;
        }

        return (
            <div className="flex flex-col gap-2">
                <InputLabel
                    htmlFor={id}
                    isError={isError}
                    isDisabled={props.disabled}
                >
                    {label}
                </InputLabel>
                <div
                    className={classNames(
                        'relative inline-flex w-full items-center'
                    )}
                >
                    <textarea
                        {...props}
                        ref={ref}
                        id={id}
                        className={classNames(
                            // Base styles
                            'h-[161px] w-full resize-none appearance-none align-top font-narrow focus:outline-none',
                            // Height
                            isNegativeExperience && '!h-[160px]',
                            // Background color
                            {
                                'bg-primary-50':
                                    !isError &&
                                    !props.disabled &&
                                    !props.readOnly &&
                                    !isLight,
                            },
                            {
                                'cursor-not-allowed bg-primary-50 opacity-50':
                                    props.disabled,
                            },
                            { 'bg-neutral-0': props.readOnly },
                            { 'bg-danger-50': isError },
                            { 'bg-neutral-0': isLight },

                            // Border
                            !isError && !props.readOnly
                                ? 'border-none'
                                : 'border-[1px]',
                            // Border color based on state
                            { 'border-none': props.disabled },
                            { 'border-neutral-100': props.readOnly },
                            { 'border-danger-500': isError },
                            // Border radius
                            BORDER_RADIUS_SM,
                            // Text color
                            'placeholder:text-input-placeholder placeholder:text-primary-300 placeholder:opacity-50',
                            { 'text-neutral-100': props.disabled },
                            { 'text-neutral-700': props.readOnly },
                            { 'text-danger-500': isError },
                            // Font size
                            'text-input',
                            // Padding
                            'px-4 pb-4 pt-2',
                            // Focus state
                            !isError &&
                                !props.readOnly &&
                                !props.disabled &&
                                'focus:bg-neutral-0 focus:text-primary-500 focus:ring-[1px] focus:ring-neutral-500',
                            {
                                'focus:ring-[1px] focus:ring-danger-500':
                                    isError,
                            },
                            // Transition
                            'transition-all duration-300 ease-in-out',
                            className
                        )}
                    />
                </div>
                {isError && <InputErrorMessage errorMessage={errorMessage} />}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;
