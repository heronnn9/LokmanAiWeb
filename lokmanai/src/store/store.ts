// src/store/store.ts
import baseApi from '@/services/api';
import { askApi } from '@/services/aiApi';
import userReducer from '@/store/slices/userSlice';
import toastReducer from '@/store/slices/toastSlice';
import chatReducer from '@/store/slices/chatSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    [askApi.reducerPath]: askApi.reducer,
    user: userReducer,
    toast: toastReducer,
    chat: chatReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [baseApi.reducerPath, askApi.reducerPath], // do NOT persist RTK Query cache
    // chat state will be persisted to keep message history
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for Redux Persist
        }).concat(baseApi.middleware, askApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
