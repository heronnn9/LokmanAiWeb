import React from 'react';
import Icon from '../Icon';

const MobileNav = ({
    handleSidebarToggle,
}: {
    handleSidebarToggle: () => void;
}) => {
    return (
        <div>
            <div className="fixed top-0 right-0 left-0 z-30 h-16 border-b border-neutral-200 bg-white md:hidden">
                <div className="flex h-full items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <Icon
                            icon="syncpro-logo"
                            color="#222222"
                            size={32}
                        />
                        <span className="text-heading-3 text-primary-500 font-gotham">
                            SyncPro
                        </span>
                    </div>

                    <button
                        onClick={handleSidebarToggle}
                        className="rounded-lg p-2 transition-colors hover:bg-neutral-100"
                        aria-label="Menüyü aç"
                    >
                        <Icon
                            icon="hamburger"
                            color="#222222"
                            className="dark:brightness-0 dark:invert"
                            size={24}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
