export type ApiBaseResponse<T> = {
    Data: T;
    Message: string | null;
    Success: boolean;
    AuditJson?: unknown;
    CreateAudit?: unknown;
};

export type ApiPagedResponse<T> = {
    pageCount: number;
    activePage: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};

export type ApiError = {
    Success: boolean;
    Message: string;
    Data: null;
    AuditJson?: unknown;
    CreateAudit?: unknown;
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
