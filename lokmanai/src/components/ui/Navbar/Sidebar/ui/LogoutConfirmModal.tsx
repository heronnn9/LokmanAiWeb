import React from 'react';
import { useModal } from '@/hooks/useModal';
import { ConfirmModal } from '@/components/ui/Modal';
import { logout } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthCookies, sessionTokens } from '@/utils/cookie';
import { useRouter } from 'next/navigation';

const LogoutConfirmModal: React.FC = () => {
    const { isModalOpen, hideModal, getModalData } = useModal('logout-confirm-modal', 'confirm');
    const router = useRouter();
    const modalData = getModalData();
    const dispatch = useAppDispatch();

    const handleConfirm = () => {
        dispatch(logout());
        clearAuthCookies();
        sessionTokens.clear();
        router.push('/giris-yap');
        hideModal();
    };

    const handleCancel = () => {
        hideModal();
    };

    return (
        <ConfirmModal
            isVisible={isModalOpen}
            title={modalData?.title || 'Çıkış Yap'}
            description={modalData?.description || 'Çıkış yapmak istediğinize emin misiniz?'}
            confirmText={modalData?.confirmText || 'Çıkış Yap'}
            cancelText={modalData?.cancelText || 'İptal'}
            confirmButtonVariant={modalData?.confirmButtonVariant || 'danger'}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
};

export default LogoutConfirmModal;
