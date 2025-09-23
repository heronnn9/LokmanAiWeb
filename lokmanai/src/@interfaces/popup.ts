export interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}