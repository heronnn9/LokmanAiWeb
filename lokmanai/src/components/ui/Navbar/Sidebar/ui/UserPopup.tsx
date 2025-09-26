import React from 'react'
import Popup from '../../../Popup/Popup'
import Icon from '../../../Icon'
import { useModal } from '@/hooks/useModal';
import ThemeSwitch from '@/components/ui/ThemeSwitch';

interface UserPopupProps {
    isUserPopupOpen: boolean;
    setIsUserPopupOpen: (isOpen: boolean) => void;
}

const UserPopup: React.FC<UserPopupProps> = ({ isUserPopupOpen, setIsUserPopupOpen }) => {

    const { showModal } = useModal('logout-confirm-modal', 'confirm');

    const handleLogoutClick = () => {
        showModal()
        setIsUserPopupOpen(false);
    };

    return (
        <div>
            <Popup
                isOpen={isUserPopupOpen}
                onClose={() => setIsUserPopupOpen(false)}
                position="bottom-left"
                className="min-w-[200px]"
            >
                <div className="py-2">
                    <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2 border-b text-left text-button-sm font-gotham hover:bg-neutral-50 dark:hover:bg-secondary-700 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center space-x-3"
                    >
                        <Icon
                            icon="logout"
                            size={16}
                            color="currentColor"
                            className="dark:brightness-0 dark:invert"
                        />
                        <span>Çıkış Yap</span>
                    </button>
                    <div className='flex gap-1 items-center px-2 py-2 '>
                        <span className='text-button-sm font-gotham text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50'>Tema Değiştir</span>
                        <ThemeSwitch />
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default UserPopup