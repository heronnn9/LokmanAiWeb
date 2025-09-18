export type SignInData = {
    userId: string;
    fullName: string;
    mail: string;
    accessToken: string;
    accessTokenExpires: number;
};

export type SignInCredential = {
    mail: string;
    password: string;
};
