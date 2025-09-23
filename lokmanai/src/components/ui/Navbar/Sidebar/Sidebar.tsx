import { MenuItem, SidebarProps, SidebarRef } from '@/@interfaces/theme';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';
import { forwardRef, useImperativeHandle, useState } from 'react';
import Icon from '../../Icon';
import { MENU_ITEMS } from '../constants/menu.items';
import LogoutConfirmModal from './ui/LogoutConfirmModal';
import SideItem from './ui/SideItem';
import SidebarHeader from './ui/SidebarHeader';
import UserPopup from './ui/UserPopup';
import UserSection from './ui/UserSection';

const menuItems: MenuItem[] = [...MENU_ITEMS];

const Sidebar = forwardRef<SidebarRef, SidebarProps>(
    ({ isCollapsed = false, onToggle }, ref) => {
        const pathname = usePathname();
        const [isMobileOpen, setIsMobileOpen] = useState(false);
        const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
        const isMobile = useScreenSize();

        useImperativeHandle(
            ref,
            () => ({
                toggleMobile: () => {
                    if (isMobile) {
                        setIsMobileOpen(!isMobileOpen);
                    }
                },
            }),
            [isMobile, isMobileOpen]
        );

        const handleToggle = () => {
            if (isMobile) {
                setIsMobileOpen(!isMobileOpen);
            }
            onToggle?.();
        };

        const handleOverlayClick = () => {
            if (isMobile) {
                setIsMobileOpen(false);
            }
        };

        // Logout handler


        const user = useAppSelector((state) => state.user);

        return (
            <>
                {/* Mobile Overlay */}
                {isMobile && isMobileOpen && (
                    <div
                        className="bg-opacity-50 fixed inset-0 z-40 bg-black/20 md:hidden"
                        onClick={handleOverlayClick}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={`fixed top-0 left-0 z-50 h-screen border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out dark:border-secondary-500 ${isMobile
                        ? isMobileOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                        : isCollapsed
                            ? 'w-16'
                            : 'w-64'
                        } ${isMobile ? 'w-64' : ''} `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-secondary-500">
                        {!isCollapsed && (
                            <SidebarHeader />
                        )}

                        <button
                            onClick={handleToggle}
                            className="rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-[#1e2530]"
                            aria-label={
                                isMobile
                                    ? isMobileOpen
                                        ? "Sidebar'ı kapat"
                                        : "Sidebar'ı aç"
                                    : isCollapsed
                                        ? "Sidebar'ı aç"
                                        : "Sidebar'ı kapat"
                            }
                        >
                            <Icon
                                icon="hamburger"
                                className="dark:brightness-0 dark:invert"
                                color="#222222"
                                size={20}
                            />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== '/' &&
                                        pathname.startsWith(item.href));

                                return (
                                    <SideItem
                                        key={item.id}
                                        item={item}
                                        isMobile={isMobile}
                                        setIsMobileOpen={setIsMobileOpen}
                                        isCollapsed={isCollapsed}
                                        isActive={isActive}
                                    />
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Section */}
                    <div className="absolute right-0 bottom-0 left-0 border-t border-neutral-200 p-4 dark:border-secondary-500">
                        <div className="relative">
                            <UserSection isUserPopupOpen={isUserPopupOpen} setIsUserPopupOpen={setIsUserPopupOpen} isMobile={isMobile} isCollapsed={isCollapsed} user={user} />
                            {/* User Popup Menu */}
                            <UserPopup isUserPopupOpen={isUserPopupOpen} setIsUserPopupOpen={setIsUserPopupOpen} />
                        </div>
                    </div>
                </div>

                {/* Logout Confirm Modal */}
                <LogoutConfirmModal />
            </>
        );
    }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
