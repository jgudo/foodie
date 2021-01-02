
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
    fullname?: string;
    profilePicture?: string;
}

export interface IRegister {
    email: string;
    password: string;
    username: string;
}