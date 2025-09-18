import classNames from 'classnames';
import {
    BORDER_RADIUS_SM,
    INPUT_HEIGHT_BASE,
    INPUT_PADDING,
} from '@/constants/theme.constants';
import { InputProps } from '@/@interfaces/input';

export const getInputClassNames = (
    props: InputProps & { id?: string },
    isError: boolean,
    isLight: boolean,
    iconType?: string,
    suffix?: React.ReactNode,
    extraContent?: React.ReactNode,
    isBarcode?: boolean,
    fullHeight?: boolean
) => {
    return classNames(
        'w-full appearance-none font-narrow focus:outline-none',
        isBarcode && 'text-sm',
        fullHeight ? 'min-h-full' : INPUT_HEIGHT_BASE,
        { 'pr-12': iconType },
        {
            'bg-primary-50':
                !isError && !props.disabled && !isLight && !props.readOnly,
        },
        props.disabled &&
            `cursor-not-allowed ${
                isLight ? 'bg-neutral-0' : 'bg-primary-50'
            } opacity-50`,
        { 'bg-neutral-0': props.readOnly },
        { 'bg-danger-50': isError },
        { 'bg-neutral-0': isLight },
        !isError && !props.readOnly ? 'border-none' : 'border-[1px]',
        { 'border-none': props.disabled },
        { 'border-neutral-100': props.readOnly },
        { 'border-danger-500': isError },
        BORDER_RADIUS_SM,
        {
            'placeholder:text-input-placeholder placeholder:text-primary-300 placeholder:opacity-50':
                props.placeholder !== 'Miatsız Ürün',
        },
        {
            'placeholder:text-primary-700':
                props.placeholder === 'Miatsız Ürün',
        },
        { 'text-neutral-100': props.disabled },
        { 'text-neutral-700': props.readOnly },
        { 'text-danger-500': isError },
        'text-input',
        INPUT_PADDING,
        {
            'pr-[calc(3.5rem+46px)]':
                suffix && (extraContent || props.type === 'password'),
        },
        {
            'pr-[calc(2.5rem+12px)]':
                suffix || extraContent || props.type === 'password',
        },
        {
            'pl-4 pr-12': props.type === 'password' && !suffix,
        },
        !isError &&
            !props.readOnly &&
            !props.disabled &&
            'focus:bg-neutral-0 focus:text-primary-500 focus:ring-[1px] focus:ring-neutral-500',
        {
            'focus:ring-[1px] focus:ring-danger-500': isError,
        },
        'transition-all duration-300 ease-in-out'
    );
};
