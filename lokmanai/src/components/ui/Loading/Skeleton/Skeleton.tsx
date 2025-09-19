// Skeleton component

import classNames from 'classnames';

interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={classNames(
                'animate-pulse rounded-md bg-neutral-100',
                className
            )}
        />
    );
};

export default Skeleton;
