export interface ModalProps {
    isVisible: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonVariant?: 'primary' | 'danger' | 'secondary';
    isLoading?: boolean;
}

export interface ConfirmModalProps {
    isVisible: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonVariant?: 'primary' | 'danger' | 'secondary';
    isLoading?: boolean;
    children?: React.ReactNode;
}

export interface ModalState {
    isOpen: boolean;
    modalName: string;
    modalType: 'confirm' | 'form' | 'info';
    data?: any;
}

export interface ShowModalPayload {
    modalName: string;
    modalType: 'confirm' | 'form' | 'info';
    isOpen: boolean;
    data?: any;
}
