export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface IRootReducer {
    auth: IUser;
    error: IError;
    loading: TLoading;
    newsFeed: INewsFeed;
    profile: IProfile;
    chats: IChatState;
    modal: IModalState;
    helper: IHelperState;
    settings: ISettingsState;
}

export interface IErrorState {
    authError: IError | null;
    profileError: IError | null;
    newsFeedError: IError | null;
}

export interface TLoading {
    isLoadingAuth: boolean;
    isLoadingCreatePost: boolean;
    isLoadingGetUser: boolean;
    isLoadingFeed: boolean;
}

export interface INewsFeed {
    items: IPost[];
    hasNewFeed: boolean;
    offset: number;
}


export interface IUser {
    id: string;
    username: string;
    fullname?: string;
    profilePicture?: Record<string, any>;
    [prop: string]: any;
}

export interface IPost {
    id: string;
    privacy: 'public' | 'private' | 'follower';
    photos: Record<string, any>[];
    comments: any[];
    description: string;
    likes: any[];
    author: IUser;
    commentsCount: number;
    likesCount: number;
    isBookmarked: boolean;
    isLiked: boolean;
    isOwnPost: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IHelperState {
    targetComment: IComment | null;
    targetPost: IPost | null;
}

export interface IModalState {
    isOpenDeleteComment: boolean;
    isOpenDeletePost: boolean;
    isOpenEditPost: boolean;
    isOpenPostLikes: boolean;
}

export enum EModalType {
    DELETE_COMMENT = 'DELETE_COMMENT',
    DELETE_POST = 'DELETE_POST',
    EDIT_POST = 'EDIT_POST',
    POST_LIKES = 'POST_LIKES'
}

export interface IComment {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    isEdited: boolean;
    depth: number;
    replyCount: number;
    likesCount: number;
    post_id: string;
    isOwnComment: boolean;
    isPostOwner: boolean;
    isLiked: boolean;
    author: IUser;
}

export interface IChatItemsState {
    username: string;
    id: string;
    offset: number;
    profilePicture?: Record<string, any>;
    minimized: boolean;
    chats: IMessage[]
}

export interface IChatState {
    items: IChatItemsState[],
    active: string;
}

export interface IProfile {
    _id: string;
    id: string;
    username: string;
    email: string;
    fullname?: string;
    firstname: string;
    lastname: string;
    info: {
        bio: string;
        birthday: string;
        gender: string;
    },
    isEmailValidated: boolean;
    profilePicture?: Record<string, any>;
    coverPhoto?: Record<string, any>;
    dateJoined: Date | string;
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

export interface IMessage {
    id: string;
    from: IUser;
    to: IUser;
    text: string;
    createdAt: Date;
    seen: boolean;
    unseenCount?: number;
    isOwnMessage?: boolean;
}

export interface ISettingsState {
    theme: 'light' | 'dark';
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
    q?: string;
    type?: string;
    sort?: 'asc' | 'desc';
}

export interface IError {
    status_code: number;
    data: any;
    error: {
        message: string;
        title: string;
        type: string;
    };
    success: boolean;
    timestamp: string | Date;
    [prop: string]: any;
}

export interface IImage {
    id: string;
    url: string;
    file: File | null;
}

export interface IFileHandler<T> {
    imageFile: T,
    setImageFile: React.Dispatch<React.SetStateAction<T>>;
    isFileLoading: boolean;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>, callback?: (file?: IImage) => void) => void;
    removeImage: (id: string) => void;
    clearFiles: () => void;
}