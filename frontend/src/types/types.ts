
export interface IRootReducer {
    auth: IAuth;
    error: IError;
    loading: TLoading;
}

export interface IError {
    authError?: string;
}

export interface TLoading {
    isLoadingAuth: boolean;
}


export interface IAuth {
    id: string | null;
    username: string | null;
}

export type TCustomClasses =
    | 'group'
    | 'focus:ring-2'
    | 'focus:ring-indigo-500'
    | 'focus:z-10'
    | 'sm:text-sm'
    | 'focus:ring-red-500'
    | 'disabled:opacity-50'
    | 'disabled:cursor-not-allowed'