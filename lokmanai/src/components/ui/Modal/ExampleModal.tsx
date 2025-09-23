import React from 'react';
import { useModal } from '@/hooks/useModal';
import { ConfirmModal } from '@/components/ui/Modal';

interface ExampleModalProps {
    modalName: string;
}

const ExampleModal: React.FC<ExampleModalProps> = ({ modalName }) => {
    const { isModalOpen, hideModal, getModalData } = useModal(modalName, 'confirm');

    const modalData = getModalData();

    const handleConfirm = () => {
        if (modalData?.onConfirm) {
            modalData.onConfirm();
        }
        hideModal();
    };

    const handleCancel = () => {
        if (modalData?.onCancel) {
            modalData.onCancel();
        }
        hideModal();
    };

    return (
        <ConfirmModal
            isVisible={isModalOpen}
            title={modalData?.title || 'Onay'}
            description={modalData?.description || 'Bu işlemi yapmak istediğinize emin misiniz?'}
            confirmText={modalData?.confirmText || 'Onayla'}
            cancelText={modalData?.cancelText || 'İptal'}
            confirmButtonVariant={modalData?.confirmButtonVariant || 'primary'}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={modalData?.isLoading || false}
        >
            {modalData?.children}
        </ConfirmModal>
    );
};

export default ExampleModal;
