import React from 'react';
import Skeleton from './Skeleton';

const InputSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-[10px] w-full" />
            <Skeleton className="h-[40px] w-full" />
        </div>
    );
};

export default InputSkeleton;
