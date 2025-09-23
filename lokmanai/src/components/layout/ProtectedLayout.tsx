import Navbar from '@/components/ui/Navbar/Navbar';
import { SAFE_ZONE_WIDTH } from '@/constants/theme.constants';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useAppSelector } from '@/store/hooks';
import classNames from 'classnames';
import { ReactNode, useRef, useState } from 'react';
import ThemeSwitch from '../ui/ThemeSwitch';
import Sidebar from '../ui/Navbar/Sidebar';

interface ProtectedLayoutProps {
    children: ReactNode;
    isSafeZone?: boolean;
    showSidebar?: boolean;
    showNavbar?: boolean;
}

const ProtectedLayout = ({
    children,
    isSafeZone = false,
    showSidebar = true, // Varsayılan olarak sidebar göster
    showNavbar = false,
}: ProtectedLayoutProps) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const sidebarRef = useRef<{ toggleMobile: () => void }>(null);

    const isMobile = useScreenSize();
    const { isAuthenticated } = useAppSelector((state) => state.user);

    const handleSidebarToggle = () => {
        if (isMobile) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            // Sidebar component'ine mobile toggle sinyali gönder
            sidebarRef.current?.toggleMobile();
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    // Auth sayfalarında sidebar/navbar gösterme
    if (!showSidebar && !showNavbar) {
        return (
            <div className="w-full relative">

                <div
                    className={classNames(
                        'mx-auto relative',
                        isSafeZone ? `max-w-[${SAFE_ZONE_WIDTH}]` : ''
                    )}
                >
                    {/* ThemeSwitch sadece authenticated kullanıcılar için göster */}

                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full">
            {/* Mobile Header with Hamburger */}
            {/* {showSidebar && isMobile && (
                <MobileNav handleSidebarToggle={handleSidebarToggle} />
            )} */}

            {/* Sidebar */}
            {showSidebar && (
                <Sidebar
                    ref={sidebarRef}
                    isCollapsed={isSidebarCollapsed}
                    onToggle={handleSidebarToggle}
                />
            )}

            {/* Navbar */}
            {showNavbar && <Navbar />}

            {/* Main Content */}
            <div
                className={classNames(
                    'transition-all duration-300 ease-in-out',
                    // Mobile için top padding (header için)
                    showSidebar && isMobile ? 'pt-16' : '',
                    // Desktop için sidebar margin
                    showSidebar && !isMobile
                        ? isSidebarCollapsed
                            ? 'ml-16'
                            : 'ml-64'
                        : 'ml-0',
                    showNavbar ? 'pt-16' : 'pt-0' // Navbar yüksekliği için padding
                )}
            >
                <div
                    className={classNames(
                        'mx-auto ',
                        isSafeZone ? `max-w-[${SAFE_ZONE_WIDTH}]` : ''
                    )}
                >
                    {isAuthenticated && (
                        <div className='absolute top-2 right-2 hidden md:block'>
                            <ThemeSwitch />
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProtectedLayout;
