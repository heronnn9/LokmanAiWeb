import { ApiBaseResponse } from '@/@types/api';
import { RootState } from '@/store/store';
import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';

const env = process.env.NEXT_PUBLIC_ENV;
const isDevBuild = env === 'devbuild';

const customFetch: typeof fetch = (input, init) => {
    return fetch(input, { cache: 'no-store', ...init });
};

const baseQuery = fetchBaseQuery({
    baseUrl: isDevBuild
        ? 'http://syncproapi.ledbim.com/api/v1'
        : process.env.NEXT_PUBLIC_API_URL +
          (process.env.NEXT_PUBLIC_API_VERSION || '/v1'),
    prepareHeaders: (headers: Headers, { getState }) => {
        // Get token using the utility function
        const accessToken = (getState() as RootState).user.accessToken;
        // If token exists, add it to headers
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        // Ensure content type is set for JSON requests
        //headers.set('Content-Type', 'application/json');

        return headers;
    },
    fetchFn: customFetch,
});

const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    Record<string, never>,
    FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    const isLoginEndpoint =
        typeof args !== 'string' && args.url === 'User/Login';
    // If there's a network or server error
    if (result.error) {
        // Handle 401 Unauthorized error
        if (
            result.error.status === 401 ||
            (result.error.data as ApiBaseResponse<unknown>)?.message ===
                'UnauthorizedException'
        ) {
            // Clear auth state
            api.dispatch({ type: 'user/logout' });
            // Clear cookies and session storage
            document.cookie =
                'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie =
                'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('refresh_token');
            // Redirect to login page
            if (!isLoginEndpoint) {
                window.location.replace('/giris-yap');
            }
        }
        return result;
    }

    // If we got a response but it indicates failure
    if (result.data && !(result.data as ApiBaseResponse<unknown>).isSuccess) {
        const apiResponse = result.data as ApiBaseResponse<unknown>;
        // Check for UnauthorizedException in the response message
        if (
            apiResponse.message === 'UnauthorizedException' ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (result.error as any)?.status === 401
        ) {
            // Clear auth state
            api.dispatch({ type: 'user/logout' });
            // Clear cookies and session storage
            document.cookie =
                'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie =
                'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('refresh_token');
            // Redirect to login page
            if (!isLoginEndpoint) {
                window.location.replace('/giris-yap');
            }
        }
        return {
            error: {
                status: 400,
                data: {
                    isSuccess: false,
                    errors: apiResponse.errors,
                    message: apiResponse.message,
                    data: null,
                },
            } as FetchBaseQueryError,
        };
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: [],
    endpoints: () => ({}),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
});

export default baseApi;
