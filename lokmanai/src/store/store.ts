// src/store/store.ts
import baseApi from '@/services/api';
import userReducer from '@/store/slices/userSlice';
import toastReducer from '@/store/slices/toastSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
    toast: toastReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [baseApi.reducerPath], // do NOT persist RTK Query cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for Redux Persist
        }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
