import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideModal, showModal } from '@/store/slices/modalSlice';

export const useModal = (
    modalName: string,
    modalType: 'confirm' | 'form' | 'info' = 'confirm'
) => {
    const dispatch = useAppDispatch();
    const isModalOpen = useAppSelector((state) => state.modal.isOpen);
    const storeModal = useAppSelector((state) => state.modal);
    
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        showModal: (data?: any) => {
            // Ensure data is serializable by removing any circular references or functions
            let serializableData = data;
            if (data && typeof data === 'object') {
                try {
                    // Test if data can be serialized
                    JSON.stringify(data);
                    serializableData = data;
                } catch (error) {
                    console.warn('Modal data contains circular references, using fallback data:', error);
                    // Create a clean copy without circular references
                    serializableData = {
                        title: data.title,
                        description: data.description,
                        confirmText: data.confirmText,
                        cancelText: data.cancelText,
                        confirmButtonVariant: data.confirmButtonVariant,
                        children: data.children
                    };
                }
            }
            
            return dispatch(showModal({ modalName, modalType, isOpen: true, data: serializableData }));
        },
        hideModal: () => dispatch(hideModal()),
        isModalOpen: isModalOpen && storeModal.modalName === modalName,
        getModalData: () => {
            const modalData = storeModal.data;
            // If data is wrapped in a data property, return that
            if (modalData?.data !== undefined) {
                return modalData.data;
            }
            // Otherwise return the data object itself
            return modalData;
        },
    };
};
