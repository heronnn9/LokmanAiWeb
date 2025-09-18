/**
 * Utility functions for managing authentication cookies
 */

/**
 * Sets authentication cookies with the provided tokens
 */
export const setAuthCookies = (accessToken: string, refreshToken: string) => {
    document.cookie = `auth_token=${accessToken}; path=/; secure; samesite=strict`;
    document.cookie = `refresh_token=${refreshToken}; path=/; secure; samesite=strict`;
};

/**
 * Clears authentication cookies
 */
export const clearAuthCookies = () => {
    document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie =
        'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

/**
 * Manages session storage for auth tokens
 */
export const sessionTokens = {
    set: (accessToken: string, refreshToken: string) => {
        sessionStorage.setItem('auth_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
    },
    clear: () => {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
    },
};
