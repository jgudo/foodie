
export interface IRootReducer {
    auth: IUser;
    error: IError;
    loading: TLoading;
    newsFeed: IPost[];
    profile: IProfile;
}

export interface IError {
    authError?: string;
    profileError?: string;
}

export interface TLoading {
    isLoadingAuth: boolean;
    isLoadingCreatePost: boolean;
    isLoadingGetUser: boolean;
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

export interface IProfile {
    id: string;
    username: string;
    email: string;
    fullname: string | null;
    firstname: string;
    lastname: string;
    info: {
        bio: string;
        birthday: Date | null;
    },
    isEmailValidated: boolean;
    profilePicture: string | null;
    coverPhoto: string | null;
    dateJoined: Date | null;
    followingCount: number;
    followersCount: number;
    [prop: string]: any;
}

export interface INotification {
    id: string;
    initiator: IProfile;
    target: IProfile,
    createdAt: Date;
    type: string;
    unread: boolean;
    link: string;
}

export interface IRegister {
    email: string;
    password: string;
    username: string;
}

export interface ICreatePost {
    description: string;
    photos?: []
}

export interface IFetchParams {
    offset?: number;
}