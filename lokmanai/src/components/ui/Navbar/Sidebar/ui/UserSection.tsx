import { UserState } from '@/@interfaces/user'
import Image from 'next/image'
import React from 'react'

const UserSection = ({ isUserPopupOpen, setIsUserPopupOpen, isMobile, isCollapsed, user }: { isUserPopupOpen: boolean, setIsUserPopupOpen: (isOpen: boolean) => void, isMobile: boolean, isCollapsed: boolean, user: UserState }) => {
    return (
        <div>
            <div
                onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}
                className={`hover:bg-primary-50 dark:hover:bg-[#1e2530] flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors ${!isMobile && isCollapsed ? 'justify-center' : ''} `}
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
                        <p className="text-button-sm font-gotham truncate text-neutral-900 dark:text-neutral-100">
                            {user.username}
                        </p>
                        <p className="text-info-small truncate text-neutral-500 dark:text-neutral-400">
                            {user.mail}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserSection