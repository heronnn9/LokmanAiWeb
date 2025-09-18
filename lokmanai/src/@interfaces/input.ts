import {
    InputHTMLAttributes,
    LabelHTMLAttributes,
    ReactNode,
    TextareaHTMLAttributes,
} from 'react';

// Label ile ilgili interface
export interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    isError?: boolean;
    isDisabled?: boolean;
}

export interface InputErrorMessageProps
    extends LabelHTMLAttributes<HTMLDivElement> {
    errorMessage: string;
}

// Input ile ilgili interface
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    iconType?: string;
    isError?: boolean;
    errorMessage?: string;
    isLoading?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    isLight?: boolean;
    suffix?: string;
    extraContent?: ReactNode;
    priceInput?: boolean;
    isBarcode?: boolean;
    onIconClick?: () => void;
    iconClassName?: string;
    copyValue?: boolean;
}

// Textarea ile ilgili interface
export interface TextAreaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label?: string;
    isError?: boolean;
    errorMessage?: string;
    isLoading?: boolean;
    isNegativeExperience?: boolean;
    isLight?: boolean;
}

// Radio button ile ilgili interface
export interface RadioButtonProps
    extends InputHTMLAttributes<HTMLInputElement> {
    color?: 'green' | 'red';
    id: string;
    value: string | number | undefined;
    label: string;
    hasContainer?: boolean;
    noPadding?: boolean;
}

export interface RadioGroupProps {
    label?: string;
    value: string | number | undefined;
    options: RadioButtonProps[];
    isEvaluation?: boolean;
    onChange: (value: string | number | undefined) => void;
}

// Select ile ilgili interface
export interface SelectOptionProps {
    id: string;
    value: string | number | null;
    name: string;
    active?: boolean;
    updateValue?: (value: string | number | null, name: string) => void;
    isFilter?: boolean;
}

// Select ile ilgili interface
export interface SelectProps {
    id: string;
    value?: string | number | null;
    label?: string;
    name?: string;
    isBarcode?: boolean;
    placeholder?: string;
    isFilter?: boolean;
    isError?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    options: SelectOptionProps[];
    onSelectOption: (value: string | number | null, name: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (event: any) => void;
    isLight?: boolean;
    required?: boolean;
    className?: string;
    noMinWidth?: boolean;
    onIconClick?: () => void;
    iconClassName?: string;
    iconType?: string;
    copyFromLabel?: boolean;
}

// QuantityInput ile ilgili interface
export interface QuantityInputProps {
    id: string;
    label?: string;
    value: number | '';
    onChange: (value: number | '') => void;
    onButtonChange?: (value: number | undefined) => void;
    onInputChange?: (value: number | '') => void;
    isError?: boolean;
    isLoading?: boolean;
    errorMessage?: string;
    increaseDisabled?: boolean;
    decreaseDisabled?: boolean;
    // onBlur event handler
    onBlur?: () => void;
}

// Checkbox ile ilgili interface
export interface CheckboxProps {
    id: string;
    label?: ReactNode;
    isFilter?: boolean;
    checked?: boolean;
    disabled?: boolean;
    isError?: boolean;
    errorMessage?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Switch ile ilgili interface
export interface SwitchProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

// Phone input interface
export interface PhoneInputProps
    extends Omit<InputProps, 'type' | 'onChange' | 'value'> {
    value?: string;
    onChange: (value: string) => void;
}
