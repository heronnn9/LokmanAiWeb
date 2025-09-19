export type SignInData = {
    User: {
        Name: string;
        UserName: string;
        Password: string;
        PasswordExpiryDate: string;
        AccountId: number;
        AccountTypeId: number;
        IsSuper: boolean;
        Auth: number;
        UserPermisions: any[];
        UserReleaseFeedbacks: any[];
        UserWarehousePermisions: any[];
        IsPasswordExpired: boolean;
        Id: number;
        CreatedDate: string;
        CreatedBy: string;
        UpdatedDate: string;
        UpdatedBy: string;
        IsDelete: boolean;
    };
    AccessToken: string;
    Expires: number;
    RefreshToken: string;
    RefreshTokenExpires: number;
};

export type SignInCredential = {
    userName: string;
    password: string;
};
