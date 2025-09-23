import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
    isVisible: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const initialState: ModalState = {  
    isVisible: false,
    title: '',
    description: '',
    onConfirm: () => {},
    onCancel: () => {},
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,   
    reducers: {
        openModal: (state, action: PayloadAction<ModalState>) => {
            state.isVisible = true;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.onConfirm = action.payload.onConfirm;
            state.onCancel = action.payload.onCancel;
        },
        closeModal: (state) => {
            state.isVisible = false;
            state.title = '';
            state.description = '';
            state.onConfirm = () => {};
            state.onCancel = () => {};
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;