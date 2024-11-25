export interface PostData {
    _id: string;
    postedBy: string;
    text: string;
    img: string[];
    likes: string[];
    replies: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export interface UserData {
    _id: string;
    name: string;
    email: string;
    username: string;
    bio: string;
    profilePic: string;
}
export interface CommentData {
    _id: string,
    username: string,
    content: string,
    createdAt: string,
    img: string,
    conversation: [],
    user: UserData,
    name: string,
    userProfilePic: string,
    userId: string
}