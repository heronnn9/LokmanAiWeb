import { PopupProps } from '@/@interfaces/popup';
import React from 'react';



const Popup: React.FC<PopupProps> = ({
    isOpen,
    onClose,
    children,
    className = '',
    position = 'bottom-left'
}) => {
    if (!isOpen) return null;

    const positionClasses = {
        'top-left': 'top-0 left-0',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-full left-0 mb-2',
        'bottom-right': 'bottom-full right-0 mb-2',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Popup Content */}
            <div className={`absolute z-50 ${positionClasses[position]} ${className}`}>
                <div className="bg-white dark:bg-secondary-800 border border-neutral-200 dark:border-secondary-600 rounded-lg shadow-lg overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Popup;