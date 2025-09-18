// Radio button component
import { RadioButtonProps } from '@/@interfaces/input';
import { BORDER_RADIUS_SM } from '@/constants/theme.constants';
import classNames from 'classnames';
import React from 'react';

const RadioButton = ({
    id,
    color = 'green',
    //value,
    label,
    hasContainer = false,
    noPadding = false,
    ...props
}: RadioButtonProps) => {
    return (
        <label
            className={classNames(
                'flex appearance-none items-center justify-center gap-2 accent-inherit',
                'h-fit w-fit',
                BORDER_RADIUS_SM,
                { 'px-4 py-2': !noPadding },
                // Border
                { 'border-points-2': color === 'green' && props.checked },
                { 'border-danger-500': color === 'red' && props.checked },
                { 'border-[1px] border-neutral-100': hasContainer },
                { 'border-none': !hasContainer },
                // Background
                { 'bg-points-10': color === 'green' && props.checked },
                { 'bg-danger-50': color === 'red' && props.checked },
                { 'bg-neutral-0': !props.checked },
                { 'bg-transparent': !hasContainer },
                {
                    'bg-neutral-0 cursor-not-allowed opacity-50':
                        props.disabled,
                },
                'cursor-pointer',
                'transition-all duration-300 ease-in-out'
            )}
        >
            <input
                {...props}
                id={id}
                type="radio"
                className={classNames(
                    'h-[14px] w-[14px] appearance-none rounded-full border border-gray-300',
                    {
                        'checked:bg-points-1 checked:ring-points-1 ring-offset-2 checked:border-transparent':
                            color === 'green' && props.checked,
                    },
                    {
                        'checked:bg-danger-500 checked:ring-danger-500 ring-offset-2 checked:border-transparent':
                            color === 'red' && props.checked,
                    },
                    {
                        'checked:bg-primary-500 checked:ring-primary-500 ring-offset-2 checked:border-transparent':
                            !hasContainer,
                    },
                    { 'ring-primary-500 border-none': !props.checked },
                    'ring-1 checked:outline-none'
                )}
            />
            <span
                className={classNames(
                    'text-button-sm',
                    { 'text-points-1': color === 'green' && props.checked },
                    { 'text-danger-500': color === 'red' && props.checked },
                    { 'text-primary-500': !props.checked || !hasContainer }
                )}
            >
                {label}
            </span>
        </label>
    );
};

export default RadioButton;
