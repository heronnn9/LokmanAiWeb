import RadioButton from './RadioButton';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface IContainerRadioButton {
    name: string;
    id: string;
    label: string;
    value: string;
    checked: boolean;
    onChange: () => void;
    children?: ReactNode;
    className?: string;
    containerClassName?: string;
    disabled?: boolean;
    fullHeight?: boolean;
}

const ContainerRadioButton = ({
    name,
    id,
    label,
    value,
    checked,
    onChange,
    children,
    className,
    containerClassName,
    disabled = false,
    fullHeight = false,
}: IContainerRadioButton) => {
    return (
        <div
            className={classNames(
                'flex w-full gap-2 rounded-[4px] border border-neutral-100 p-4',
                'flex-col items-start sm:flex-row sm:items-center sm:justify-between',
                { 'sm:h-[62px]': !fullHeight },
                {
                    'border-neutral-500 bg-primary-50': checked,
                    'cursor-not-allowed opacity-50': disabled,
                    'cursor-pointer': !disabled,
                },
                containerClassName
            )}
            onClick={disabled ? undefined : onChange}
        >
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <RadioButton
                    name={name}
                    id={id}
                    label={label}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={className}
                    noPadding={true}
                />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};

export default ContainerRadioButton;
