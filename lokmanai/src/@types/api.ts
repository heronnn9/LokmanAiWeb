export type ApiBaseResponse<T> = {
    data: T;
    message: string;
    isSuccess: boolean;
    errors?: string[] | null;
};

export type ApiPagedResponse<T> = {
    pageCount: number;
    activePage: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};

export type ApiError = {
    isSuccess: boolean;
    errors?: string[] | null;
    message: string;
    data: null;
};

export type RTKQueryError = {
    data: ApiError;
    status: number;
};

export type ApiFilterListRequest = {
    Query?: string;
    SortType?: number;
    ActivePageNumber?: number;
    PageSize?: number;
};
