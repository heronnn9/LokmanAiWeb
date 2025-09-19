import { ApiBaseResponse } from '@/@types/api';
import { SignInCredential, SignInData } from '@/@types/auth';
import { setCredentials } from '@/store/slices/userSlice';
import { clearAuthCookies, setAuthCookies } from '@/utils/cookie';
import baseApi from './api';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation<SignInData, SignInCredential>({
            query: (credentials) => ({
                url: 'User/Login',
                method: 'POST',
                body: {
                    userName: credentials.userName,
                    password: credentials.password,
                },
            }),
            transformResponse: (response: ApiBaseResponse<SignInData>) => {
                return response.data;
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Set auth cookies with both access and refresh tokens
                    setAuthCookies(data.AccessToken, data.RefreshToken);
                    // Store auth state in Redux
                    dispatch(
                        setCredentials({
                            id: data.User.Id.toString(),
                            mail: data.User.UserName, // UserName is the email/username
                            username: data.User.Name, // Name is the display name
                            accessToken: data.AccessToken,
                            refreshToken: data.RefreshToken,
                        })
                    );
                    // Store tokens in sessionStorage as backup
                    sessionStorage.setItem('auth_token', data.AccessToken);
                    sessionStorage.setItem('refresh_token', data.RefreshToken);
                } catch {
                    // Handle error if needed
                    clearAuthCookies();
                    sessionStorage.removeItem('auth_token');
                    sessionStorage.removeItem('refresh_token');
                }
            },
            extraOptions: {},
        }),
    }),
});

export const { useLoginMutation } = authApi;
