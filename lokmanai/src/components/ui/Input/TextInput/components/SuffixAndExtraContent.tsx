import React from 'react';
import classNames from 'classnames';

interface SuffixAndExtraContentProps {
    suffix?: React.ReactNode;
    extraContent?: React.ReactNode;
    disabled?: boolean;
    isError: boolean;
}

const SuffixAndExtraContent: React.FC<SuffixAndExtraContentProps> = ({
    suffix,
    extraContent,
    disabled,
    isError,
}) => {
    return (
        <div className="absolute right-4 top-1/2 flex h-full max-h-6 -translate-y-1/2 items-center gap-2">
            {suffix && (
                <div
                    className={classNames(
                        disabled && 'text-primary-50 opacity-50',
                        'flex items-center',
                        'text-button-light font-light',
                        isError && 'text-danger-500',
                        !isError && !disabled && 'text-primary-500'
                    )}
                >
                    {suffix}
                </div>
            )}
            {extraContent && suffix && (
                <div className="h-full w-[1px] bg-neutral-500" />
            )}
            {extraContent && (
                <div
                    className={classNames(
                        disabled && 'opacity-50',
                        'flex items-center'
                    )}
                >
                    {extraContent}
                </div>
            )}
        </div>
    );
};

export default SuffixAndExtraContent;
