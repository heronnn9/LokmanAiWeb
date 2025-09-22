import { useScreenSize } from '@/hooks/useScreenSize';
import { useAppSelector } from '@/store/hooks';
import React from 'react';

const Navbar = () => {
    const user = useAppSelector((state) => state.user);
    console.log(user);
    const isMobile = useScreenSize();
    return <div className='w-full h-16 bg-white dark:!bg-secondary-700 flex items-center p-4 justify-end'>Navbar</div>;
};

export default Navbar;
