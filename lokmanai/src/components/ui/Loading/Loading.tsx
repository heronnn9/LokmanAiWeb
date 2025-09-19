'use client';
import classNames from 'classnames';
import type { CommonProps } from '@/@types/common';
import type { ElementType, ReactNode } from 'react';
import Spinner from './Spinner/Spinner';

interface BaseLoadingProps extends CommonProps {
    asElement?: ElementType;
    customLoader?: ReactNode;
    loading?: boolean;
    spinnerClass?: string;
}

interface LoadingProps extends BaseLoadingProps {
    type?: 'default' | 'cover';
}

const DefaultLoading = (props: BaseLoadingProps) => {
    const {
        loading,
        children,
        spinnerClass,
        className,
        asElement: Component = 'div',
        customLoader,
    } = props;

    return loading ? (
        <Component
            className={classNames(
                !customLoader && 'flex h-full items-center justify-center',
                className
            )}
        >
            {customLoader ? (
                <>{customLoader}</>
            ) : (
                <Spinner
                    className={spinnerClass}
                    size="md"
                />
            )}
        </Component>
    ) : (
        <>{children}</>
    );
};

const CoveredLoading = (props: BaseLoadingProps) => {
    const {
        loading,
        children,
        spinnerClass,
        className,
        asElement: Component = 'div',
        customLoader,
    } = props;

    return (
        <Component className={classNames(loading ? 'relative' : '', className)}>
            {children}
            {loading && (
                <div className="absolute inset-0 h-full w-full bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-60" />
            )}
            {loading && (
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
                    {customLoader ? (
                        <>{customLoader}</>
                    ) : (
                        <Spinner
                            className={spinnerClass}
                            size="md"
                        />
                    )}
                </div>
            )}
        </Component>
    );
};

const Loading = (props: LoadingProps) => {
    const {
        type = 'default',
        loading = false,
        asElement = 'div',
        ...rest
    } = props;

    switch (type) {
        case 'default':
            return (
                <DefaultLoading
                    loading={loading}
                    asElement={asElement}
                    {...(rest as Omit<
                        BaseLoadingProps,
                        'loading' | 'asElement'
                    >)}
                />
            );
        case 'cover':
            return (
                <CoveredLoading
                    loading={loading}
                    asElement={asElement}
                    {...(rest as Omit<
                        BaseLoadingProps,
                        'loading' | 'asElement'
                    >)}
                />
            );
        default:
            return (
                <DefaultLoading
                    loading={loading}
                    asElement={asElement}
                    {...(rest as Omit<
                        BaseLoadingProps,
                        'loading' | 'asElement'
                    >)}
                />
            );
    }
};

export default Loading;
