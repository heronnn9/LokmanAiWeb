import React from 'react'
import Icon from '../../../Icon';
import Link from 'next/link';
import { MenuItem } from '@/@interfaces/theme';

const SideItem = ({ item, isMobile, setIsMobileOpen, isCollapsed, isActive }: { item: MenuItem, isMobile: boolean, setIsMobileOpen: (isOpen: boolean) => void, isCollapsed: boolean, isActive: boolean }) => {
    return (
        <div>
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
        </div>
    )
}

export default SideItem