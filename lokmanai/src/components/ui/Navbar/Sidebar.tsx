import { MenuItem, SidebarProps, SidebarRef } from '@/@interfaces/theme';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useAppSelector } from '@/store/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, useImperativeHandle, useState } from 'react';
import Icon from '../Icon';
import { MENU_ITEMS } from './constants/menu.items';

const menuItems: MenuItem[] = [...MENU_ITEMS];

const Sidebar = forwardRef<SidebarRef, SidebarProps>(
    ({ isCollapsed = false, onToggle }, ref) => {
        const pathname = usePathname();
        const [isMobileOpen, setIsMobileOpen] = useState(false);
        const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

        const isMobile = useScreenSize();

        // Ref methods
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

        // Mobile'da sidebar toggle
        const handleToggle = () => {
            if (isMobile) {
                setIsMobileOpen(!isMobileOpen);
            }
            onToggle?.();
        };

        // Mobile'da overlay click ile kapat
        const handleOverlayClick = () => {
            if (isMobile) {
                setIsMobileOpen(false);
            }
        };

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
                            <h1 className="text-primary-700 text-heading-1 flex items-center gap-1">
                                <Image src="/icons/lokman.svg" alt="LokmanAI" width={24} height={24} />
                                Lokman
                                <b className="text-secondary-500 text-heading-1">
                                    AI
                                </b>
                            </h1>
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
                                    <li key={item.id}>
                                        <Link
                                            href={item.href}
                                            onClick={() => {
                                                // Mobile'da menü tıklandığında sidebar'ı kapat
                                                if (isMobile) {
                                                    setIsMobileOpen(false);
                                                }
                                            }}
                                            className={`group flex items-center space-x-3 rounded-lg p-3 transition-all duration-200 ${isActive
                                                ? 'bg-primary-50 dark:bg-primary-700 text-primary-500'
                                                : 'hover:text-primary-500 hover:bg-primary-50 text-neutral-700 dark:text-neutral-300 dark:hover:bg-[#1e2530]'
                                                } ${!isMobile && isCollapsed ? 'justify-center' : ''} `}
                                        >
                                            <Icon
                                                icon={item.icon}
                                                className="dark:brightness-0 dark:invert"
                                                color="#222222"
                                                size={20}
                                            />

                                            {(isMobile || !isCollapsed) && (
                                                <span className="text-button-sm font-gotham">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Section */}
                    <div className="absolute right-0 bottom-0 left-0 border-t border-neutral-200 p-4 dark:border-secondary-500">
                        <div
                            className={`hover:bg-primary-50 flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors ${!isMobile && isCollapsed ? 'justify-center' : ''} `}
                        >
                            <div className="bg-primary-100 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                                <Image
                                    src="/icons/profile.svg"
                                    alt="Profile"
                                    width={16}
                                    height={16}
                                    className="h-4 w-4 dark:brightness-0 dark:invert"
                                />
                            </div>

                            {(isMobile || !isCollapsed) && (
                                <div className="min-w-0 flex-1">
                                    <p className="text-button-sm font-gotham truncate text-neutral-900">
                                        {user.username}
                                    </p>
                                    <p className="text-info-small truncate text-neutral-500">
                                        {user.mail}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </>
        );
    }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
