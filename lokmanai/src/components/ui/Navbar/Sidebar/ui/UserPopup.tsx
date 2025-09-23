import React from 'react'
import Popup from '../../../Popup/Popup'
import Icon from '../../../Icon'
import { useModal } from '@/hooks/useModal';

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
                        className="w-full px-4 py-3 text-left text-button-sm font-gotham hover:bg-neutral-50 dark:hover:bg-secondary-700 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center space-x-3"
                    >
                        <Icon
                            icon="logout"
                            size={16}
                            color="currentColor"
                            className="dark:brightness-0 dark:invert"
                        />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </Popup>
        </div>
    )
}

export default UserPopup