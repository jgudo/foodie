
export interface IRootReducer {
    auth: IAuth
}


export interface IAuth {
    id: string | null;
    username: string | null;
}