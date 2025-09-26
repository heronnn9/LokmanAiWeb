import { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sort?: {
        order: 'asc' | 'desc' | ''
        key: string | number
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace TypeAttributes {
    type Size = 'lg' | 'md' | 'sm' | 'xs'
    type Shape = 'round' | 'circle' | 'none'
    type Status = 'success' | 'warning' | 'danger' | 'info'
    type FormLayout = 'horizontal' | 'vertical' | 'inline'
    type ControlSize = 'lg' | 'md' | 'sm'
    type MenuVariant = 'light' | 'dark' | 'themed' | 'transparent'
    type Direction = 'ltr' | 'rtl'
}

/* Varolan bir type'ın herhangi bir değerini alabileceği durumları için kullanılır. */
export type OrWhatever<T> =
    | T
    | { [key: string]: T }
    | { [key: number]: T }
    | null
    | undefined;

export interface PagedViewProps<T> {
    dataItems: T[];
    isLoading: boolean;
    isSuccess?: boolean;
    onLoadMore: (page: number) => void;
    totalCount: number;
    pageCount: number;
    resetDependencies?: readonly unknown[];
}
