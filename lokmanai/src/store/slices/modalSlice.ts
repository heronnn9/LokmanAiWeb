import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    modalName: string;
    modalType: 'confirm' | 'form' | 'info';
    data?: any;
}

const initialState: ModalState = {
    isOpen: false,
    modalName: '',
    modalType: 'confirm',
    data: undefined,
};

interface ShowModalPayload {
    modalName: string;
    modalType: 'confirm' | 'form' | 'info';
    isOpen: boolean;
    data?: any;
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<ShowModalPayload>) => {
            state.isOpen = action.payload.isOpen;
            state.modalName = action.payload.modalName;
            state.modalType = action.payload.modalType;
            state.data = action.payload.data;
        },
        hideModal: (state) => {
            state.isOpen = false;
            state.modalName = '';
            state.modalType = 'confirm';
            state.data = undefined;
        },
    },
});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;