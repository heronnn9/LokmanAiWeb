import { UserState } from '@/@interfaces/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {
    isAuthenticated: false,
    id: '',
    mail: '',
    username: '',
    accessToken: null,
    refreshToken: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                id: string;
                accessToken: string;
                refreshToken: string;
                username: string;
                mail: string;
            }>
        ) => {
            const { id, accessToken, refreshToken, username, mail } =
                action.payload;

            state.isAuthenticated = true;
            state.id = id;
            state.username = username;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.mail = mail;
        },
        setMail: (state, action: PayloadAction<string>) => {
            state.mail = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.id = '';
            state.mail = '';
            state.username = '';
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setCredentials, setMail, logout } = userSlice.actions;

export default userSlice.reducer;
