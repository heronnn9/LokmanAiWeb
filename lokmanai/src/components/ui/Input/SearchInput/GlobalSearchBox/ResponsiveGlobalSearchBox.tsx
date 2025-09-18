import { GlobalSearchResponse } from '@/@interfaces/models/home';
import { useEffect, useState } from 'react';
import GlobalSearchBox from './GlobalSearchBox';
import MobileGlobalSearchBox from './MobileGlobalSearchBox';

const ResponsiveGlobalSearchBox = ({
    data,
    value,
    setValue,
    isLoading,
    handleCloseSearch,
}: {
    data: GlobalSearchResponse;
    value: string;
    setValue: (value: string) => void;
    isLoading: boolean;
    handleCloseSearch: () => void;
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        // Check initial size
        checkIfMobile();

        // Add event listener for resize
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    if (isMobile) {
        return (
            <MobileGlobalSearchBox
                data={data}
                value={value}
                setValue={setValue}
                isLoading={isLoading}
                handleCloseSearch={handleCloseSearch}
            />
        );
    }

    return (
        <GlobalSearchBox
            data={data}
            value={value}
            setValue={setValue}
            isLoading={isLoading}
            handleCloseSearch={handleCloseSearch}
        />
    );
};

export default ResponsiveGlobalSearchBox;
