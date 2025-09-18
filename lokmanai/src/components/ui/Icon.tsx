import classNames from 'classnames';
import { useMemo } from 'react';

interface IconProps {
    icon: string;
    size?: number;
    color?: string;
    className?: string;
}

const Icon = ({ icon, size = 24, color = '#F9F9F9', className }: IconProps) => {
    const iconPath = `/icons/${icon}.svg`;

    return useMemo(
        () => (
            <div
                className={classNames(
                    'icon transition-all duration-300 ease-in-out',
                    className
                )}
                style={{
                    maskImage: `url(${iconPath})`,
                    maskSize: 'contain',
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    backgroundColor: color,
                    width: size,
                    aspectRatio: '1/1',
                    height: size,
                }}
            />
        ),
        [iconPath, size, color, className]
    );
};

export default Icon;
