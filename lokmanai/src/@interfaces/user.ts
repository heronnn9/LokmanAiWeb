export interface UserState {
    isAuthenticated: boolean;
    id: string;
    mail: string;
    username: string;
    accessToken: string | null;
    refreshToken: string | null;
}
