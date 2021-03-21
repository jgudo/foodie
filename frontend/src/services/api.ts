import { IBookmark, IComment, IFetchParams, IMessage, INotification, IPost, IProfile, IRegister, IUser } from '~/types/types';
import httpRequest from './fetcher';

export const login = (username: string, password: string) => httpRequest<IUser>({
    method: 'POST',
    url: '/authenticate',
    data: { username, password }
})

export const checkAuthSession = () => httpRequest<{ auth: IUser }>({ method: 'GET', url: '/check-session' });

export const register = ({ email, password, username }: IRegister) => httpRequest<IUser>({
    method: 'POST',
    url: '/register',
    data: { username, password, email }
})

export const logout = () => httpRequest<any>({ method: 'DELETE', url: '/logout' });

export const getNewsFeed = (params: IFetchParams) => httpRequest<IPost[]>({
    method: 'GET',
    url: '/feed',
    params
})

//  ------------------- POST METHODS ------------------

export const getSinglePost = (postID: string) => httpRequest<IPost>({ method: 'GET', url: `/post/${postID}` });

export const createPost = (post: FormData) => httpRequest<IPost>({
    method: 'POST',
    url: '/post',
    data: post
})

export const getPosts = (username: string, params: IFetchParams) => {
    return httpRequest<IPost[]>({
        method: 'GET',
        url: `/${username}/posts`,
        params
    })
}

export const deletePost = (postID: string) => httpRequest<IPost>({ method: 'DELETE', url: `/post/${postID}` })

export const updatePost = (postID: string, updates: Partial<IPost>) => {
    return httpRequest<IPost>({
        method: 'PATCH',
        url: `/post/${postID}`,
        data: updates
    })
}

export const likePost = (id: string) => {
    return httpRequest<{ state: boolean; likesCount: number }>({
        method: 'POST',
        url: `/like/post/${id}`
    })
}

export const getPostLikes = (postID: string, params: IFetchParams) => {
    return httpRequest<IProfile[]>({
        method: 'GET',
        url: `/post/likes/${postID}`,
        params
    })
}

//  ------------------ USER METHODS ---------------------

export const getUser = (username: string) => httpRequest<IUser>({ method: 'GET', url: `/${username}` })

export const updateUser = (username: string, updates: Partial<IProfile>) => {
    return httpRequest<IProfile>({
        method: 'PATCH',
        url: `/${username}/edit`,
        data: updates
    })
}

// --------------- COMMENT METHODS ------------------------

export const getComments = (postID: string, { offset = 0, limit, skip, sort = 'desc' }: IFetchParams) => {
    return httpRequest<IComment[]>({
        method: 'GET',
        url: `/comment/${postID}`,
        params: { offset, limit, skip, sort }
    })
}

export const deleteComment = (commentID: string) => {
    return httpRequest<IComment>({ method: 'DELETE', url: `/comment/${commentID}` });
}

export const commentOnPost = (postID: string, body: string) => httpRequest<IComment>({
    method: 'POST',
    url: `/comment/${postID}`,
    data: { body }
})

export const updateComment = (commentID: string, body: string) => {
    return httpRequest<IComment>({
        method: 'PATCH',
        url: `/comment/${commentID}`,
        data: { body }
    })
}

export const likeComment = (commentID: string) => {
    return httpRequest<{ state: boolean; likesCount: number }>({
        method: 'POST',
        url: `/like/comment/${commentID}`
    });
}

export const replyOnComment = (body: string, comment_id: string, post_id: string) => {
    return httpRequest<IComment>({
        method: 'POST',
        url: `/reply`,
        data: {
            body,
            comment_id,
            post_id
        }
    })
}

export const getCommentReplies = (params: IFetchParams & { comment_id: string; post_id: string }) => {
    return httpRequest<IComment[]>({
        method: 'GET',
        url: `/reply`,
        params: {
            offset: params.offset,
            comment_id: params.comment_id,
            post_id: params.post_id
        }
    })
}

// ------------------ NOTIFICATION METHOD ----------------

export const getNotifications = (params: IFetchParams) => {
    return httpRequest<{ notifications: INotification[]; unreadCount: number; count: number; }>({
        method: 'GET',
        url: `/notifications`,
        params: { offset: params.offset }
    })
}

// ---------------- FOLLOW METHODS -----------------------------

export const followUser = (id: string) => httpRequest<{ state: boolean }>({ method: 'POST', url: `/follow/${id}` });

export const unfollowUser = (id: string) => httpRequest<{ state: boolean }>({
    method: 'POST',
    url: `/unfollow/${id}`
})

export const getFollowers = (username: string, { offset = 0 }: IFetchParams) => {
    return httpRequest<IProfile[]>({
        method: 'GET',
        url: `/${username}/followers`,
        params: { offset }
    })
}

export const getFollowing = (username: string, params: IFetchParams) => {
    return httpRequest<IProfile[]>({
        method: 'GET',
        url: `/${username}/following`,
        params
    })
}

export const getSuggestedPeople = async (params: IFetchParams) => {
    return httpRequest<IProfile[]>({
        method: 'GET',
        url: `/people/suggested`,
        params
    })
}

//  ---------- NOTIFICATION METHODS ---------------
export const readNotification = (id: string) => {
    return httpRequest<{ state: boolean; }>({
        method: 'PATCH',
        url: `/read/notification/${id}`
    })
}

export const getUnreadNotifications = () => httpRequest<{ count: number; }>({ method: 'GET', url: `/notifications/unread` })

export const markAllAsUnreadNotifications = () => {
    return httpRequest<{ state: boolean; }>({ method: 'PATCH', url: `/notifications/mark` })
}

//  ---------- BOOKMARK METHODS ----------------

export const getBookmarks = (params: IFetchParams) => httpRequest<IBookmark[]>({
    method: 'GET',
    url: `/bookmarks`,
    params
})

export const bookmarkPost = (postID: string) => httpRequest<{ state: boolean }>({
    method: 'POST',
    url: `/bookmark/post/${postID}`
})

//  ----------------- UPLOAD METHODS --------------

export const uploadPhoto = async (data: FormData, field: string) => {
    return httpRequest<{ image: Object }>({
        method: 'POST',
        url: `/upload/${field}`,
        data
    })
}

//  ---------------- SEARCH METHOD --------------
export const search = async (params: IFetchParams) => {
    return httpRequest<IPost[] | IProfile[]>({
        method: 'GET',
        url: `/search`,
        params
    })
}

//  ---------------- MESSAGE METHODS -------------

export const getMessages = (params?: IFetchParams) => {
    return httpRequest<IMessage[]>({
        method: 'GET',
        url: `/messages`,
        params
    })
}

export const readMessage = (senderID: string) => {
    return httpRequest<{ state: boolean }>({
        method: 'PATCH',
        url: `/message/read/${senderID}`
    })
}

export const getUnreadMessages = () => httpRequest<{ count: number }>({ method: 'GET', url: `/messages/unread` })

export const sendMessage = (text: string, to: string) => {
    return httpRequest<IMessage>({
        method: 'POST',
        url: `/message/${to}`,
        data: { text }
    })
}

export const getUserMessages = (targetID: string, params: IFetchParams) => {
    return httpRequest<IMessage[]>({
        method: 'GET',
        url: `/messages/${targetID}`,
        params
    })
}
