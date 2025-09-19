import React from 'react';
import classNames from 'classnames';
import Icon from '../../../Icon';

interface RightIconProps {
    iconType?: string;
    onIconClick?: () => void;
    copyValue?: boolean;
    handleCopy: () => void;
    iconClassName?: string;
}

const RightIcon: React.FC<RightIconProps> = ({
    iconType,
    onIconClick,
    copyValue,
    handleCopy,
    iconClassName,
}) => {
    if (!iconType) return null;

    return (
        <div
            className={classNames('absolute right-4 z-10', iconClassName, {
                'cursor-pointer': onIconClick || copyValue,
            })}
            onClick={copyValue ? handleCopy : onIconClick}
        >
            <Icon
                className="dark:brightness-0 dark:invert"
                icon={copyValue ? 'copy' : iconType}
                color={iconType === 'delete' ? '#FF0000' : '#001732'}
            />
        </div>
    );
};

export default RightIcon;
