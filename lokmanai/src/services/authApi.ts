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
                    mail: credentials.mail,
                    password: credentials.password,
                },
            }),
            transformResponse: (response: ApiBaseResponse<SignInData>) => {
                return response.data;
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Set auth cookies (refreshToken yok, sadece accessToken)
                    setAuthCookies(data.accessToken, '');
                    // Store auth state in Redux
                    dispatch(
                        setCredentials({
                            id: data.userId,
                            mail: data.mail,
                            username: data.fullName,
                            accessToken: data.accessToken,
                            refreshToken: '', // API'da refreshToken yok
                        })
                    );
                    // Store tokens in sessionStorage as backup
                    sessionStorage.setItem('auth_token', data.accessToken);
                    sessionStorage.removeItem('refresh_token'); // Artık yok
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
