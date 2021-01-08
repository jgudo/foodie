
export interface IRootReducer {
    auth: IUser;
    error: IError;
    loading: TLoading;
    newsFeed: INewsFeed;
    profile: IProfile;
}

export interface IError {
    authError?: string;
    profileError?: string;
    newsFeedError?: string;
}

export interface TLoading {
    isLoadingAuth: boolean;
    isLoadingCreatePost: boolean;
    isLoadingGetUser: boolean;
    isLoadingFeed: boolean;
}

export interface INewsFeed {
    items: IPost[];
    offset: number;
}


export interface IUser {
    id: string;
    username: string;
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
    updatedAt: Date;
}

export interface IComment {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    author: IUser;
}

export interface IProfile {
    _id: string;
    id: string;
    username: string;
    email: string;
    fullname: string | null;
    firstname: string;
    lastname: string;
    info: {
        bio: string;
        birthday: Date | null;
        gender: string;
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

export interface IBookmark {
    id: string;
    isBookmarked: boolean;
    post: IPost;
    createdAt: Date;
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
    limit?: number;
    skip?: number;
    sort?: 'asc' | 'desc';
}