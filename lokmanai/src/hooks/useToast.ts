import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showToast, hideToast } from '@/store/slices/toastSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
interface ShowToastOptions {
    type: 'success' | 'warning' | 'information';
    message: string | FetchBaseQueryError | SerializedError;
    duration?: number;
    top?: string;
}

const useToast = () => {
    const dispatch = useAppDispatch();
    const toast = useAppSelector((state) => state.toast);

    const show = useCallback(
        ({ type, message, duration, top }: ShowToastOptions) => {
            dispatch(showToast({ type, message, duration, top }));
        },
        [dispatch]
    );

    const hide = useCallback(() => {
        dispatch(hideToast());
    }, [dispatch]);

    return {
        show,
        hide,
        isVisible: toast.isVisible,
        type: toast.type,
        message: toast.message,
        duration: toast.duration,
        top: toast.top,
    };
};

export default useToast;
