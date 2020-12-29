
export interface BVerifiedCodeBodyModule {
    code: string;
}

export interface BVerifiedHistory {
    pageSize: number;
    pageNo: number;
}

export interface BExcelDataQuery {
    startTime?: string | Date;
    endTime?: string | Date;
}

export interface BUserData {
    userPhone: string;
    shopCode: string;
    userName: string;
    userId: string;
}
