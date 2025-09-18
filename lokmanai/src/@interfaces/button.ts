import { ButtonHTMLAttributes } from 'react';

// Base button interface
export interface IButtonBase extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    customClassName?: string;
}

// Common properties interfaces
export interface IButtonSize {
    size?: 'xs' | 'sm' | 'base';
}

export interface IButtonIcon {
    iconType?: string;
    iconSize?: number;
}

export interface IButtonWidth {
    fullWidth?: boolean;
    isNavbar?: boolean;
}

export interface IButtonState {
    isPressed?: boolean;
    isLight?: boolean;
}

export interface IButtonVariant<T extends string> {
    variant?: T;
}

export interface IButtonUnderline {
    isUnderlined?: boolean;
}

export interface IButtonArrow {
    hasArrowIcon?: boolean;
}

// Composed button interfaces
export type ButtonProps = IButtonBase;

export interface PrimaryButtonProps
    extends IButtonBase,
        IButtonSize,
        IButtonIcon,
        IButtonState,
        IButtonWidth,
        IButtonVariant<'primary' | 'secondary' | 'danger'> {}
