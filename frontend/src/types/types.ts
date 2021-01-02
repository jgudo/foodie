
export interface IRootReducer {
    auth: IUser;
    error: IError;
    loading: TLoading;
    newsFeed: IPost[];
}

export interface IError {
    authError?: string;
}

export interface TLoading {
    isLoadingAuth: boolean;
}


export interface IUser {
    id: string | null;
    username: string | null;
    fullname?: string;
    profilePicture?: string;
}

export interface IPost {
    id: string;
    privacy: 'public' | 'private' | 'friends';
    photos: string[];
    comments: any[];
    description: string;
    likes: any[];
    author: IUser;
    commentsCount: number;
    likesCount: number;
    isBookmarked: boolean;
    isLiked: boolean;
    createdAt: Date;
    updatedAt?: Date;

}

export interface IRegister {
    email: string;
    password: string;
    username: string;
}

export interface IGetNewsFeed {
    offset?: number;
}