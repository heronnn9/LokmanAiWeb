'use client';
// Primary button component

import classNames from 'classnames';
import React, { useState } from 'react';
import { PrimaryButtonProps } from '@/@interfaces/button';
import {
    BORDER_RADIUS_SM,
    BUTTON_HEIGHT_BASE,
    BUTTON_HEIGHT_SM,
    BUTTON_HEIGHT_XS,
    BUTTON_ICON_PADDING,
    BUTTON_PADDING,
} from '@/constants/theme.constants';
import Icon from '../Icon';

const Button = ({
    variant = 'secondary',
    isLoading = false,
    isPressed = false,
    size = 'base',
    iconType = undefined,
    fullWidth = false,
    isNavbar = false,
    customClassName = undefined,
    isLight = false,
    ...props
}: PrimaryButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            {...props}
            className={classNames(
                // base class
                'cap-height whitespace-nowrap select-none',
                // Background color
                !isPressed
                    ? isLoading
                        ? 'bg-primary-700'
                        : props.disabled
                            ? 'bg-primary-50'
                            : isNavbar === true
                                ? 'bg-secondary-50 hover:bg-secondary-500'
                                : variant === 'primary'
                                    ? 'bg-primary-500 hover:bg-primary-700'
                                    : variant === 'danger'
                                        ? 'bg-danger-500 hover:bg-danger-700'
                                        : 'bg-secondary-500 hover:bg-secondary-700'
                    : 'bg-primary-700',
                // Text color
                props.disabled
                    ? isLight
                        ? 'text-neutral-0'
                        : 'text-neutral-100'
                    : isNavbar === true
                        ? 'text-secondary-500 hover:text-neutral-0'
                        : 'text-neutral-0',
                // font size
                size === 'xs'
                    ? 'text-button-xs'
                    : size === 'sm'
                        ? 'text-button-sm'
                        : 'text-button',
                customClassName && customClassName,
                // width
                fullWidth ? 'w-full' : 'w-fit',
                // height
                size === 'xs'
                    ? BUTTON_HEIGHT_XS
                    : size === 'sm'
                        ? BUTTON_HEIGHT_SM
                        : BUTTON_HEIGHT_BASE,
                // Border radius
                BORDER_RADIUS_SM,
                // Border Color
                isNavbar ? 'border-secondary-200 border' : 'border-transparent',
                // Padding
                iconType === undefined || isLoading
                    ? BUTTON_PADDING
                    : BUTTON_ICON_PADDING,
                // transition
                'transition-all duration-300 ease-in-out',
                // container
                'inline-flex items-center justify-center gap-2',
                // isLoading and disabled states
                (isLoading || props.disabled || isPressed) &&
                'pointer-events-none cursor-not-allowed'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {iconType && (
                <Icon
                    icon={iconType}
                    className="dark:brightness-0 dark:invert"
                    size={size === 'sm' ? 20 : 24}
                    color={
                        isHovered
                            ? '#F9F9F9'
                            : variant === 'primary'
                                ? '#F9F9F9'
                                : '#FF6F00'
                    }
                />
            )}
            {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {props.children}
        </button>
    );
};

export default Button;
