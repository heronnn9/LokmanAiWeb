import { ConfirmModalProps } from '@/@interfaces/modal';
import React from 'react';
import Button from '../Button/Button';

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isVisible,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = 'Onayla',
    cancelText = 'İptal',
    confirmButtonVariant = 'primary',
    isLoading = false,
    children
}) => {
    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-secondary-600 w-full max-w-md mx-auto">
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <h2 className="text-heading-2 font-gotham text-neutral-900 dark:text-neutral-100">
                            {title}
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                        <p className="text-body text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {description}
                        </p>

                        {/* Children Content */}
                        {children && (
                            <div className="mt-4">
                                {children}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 p-6 pt-0 ">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="min-w-[80px]"
                        >
                            {cancelText}
                        </Button>

                        <Button
                            variant={confirmButtonVariant}
                            size="sm"
                            onClick={onConfirm}
                            isLoading={isLoading}
                            disabled={isLoading}
                            className="min-w-[80px]"
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;