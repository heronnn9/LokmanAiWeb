import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ToastState {
    isVisible: boolean;
    type: 'success' | 'warning' | 'information';
    message: string | FetchBaseQueryError | SerializedError;
    duration: number;
    top?: string;
}

const initialState: ToastState = {
    isVisible: false,
    type: 'information',
    message: '',
    duration: 10000,
    top: '200px',
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (
            state,
            action: PayloadAction<{
                type: 'success' | 'warning' | 'information';
                message: string | FetchBaseQueryError | SerializedError;
                duration?: number;
                top?: string;
            }>
        ) => {
            state.isVisible = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
            if (action.payload.duration) {
                state.duration = action.payload.duration;
            }
            if (action.payload.top) {
                state.top = action.payload.top;
            }
        },
        hideToast: (state) => {
            state.isVisible = false;
            state.type = 'information';
            state.message = '';
            state.duration = 10000;
            state.top = '50px';
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
