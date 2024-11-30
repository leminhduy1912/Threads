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
export interface NotificationData {
    _id: string;
    receiver: string; // ID của người nhận thông báo
    sender: {
        _id: string;
        name: string;
        profilePic: string;
    }; // Thông tin về người gửi
    type: "like" | "comment" | "reply" | "follow" | "message"; // Loại thông báo
    content: string; // Nội dung thông báo
    post?: {
        _id: string;
        text: string;
        img: string;
    }; // Bài viết liên quan (nếu có)
    message?: string; // Tin nhắn liên quan (nếu có)
    isRead: boolean; // Trạng thái đã đọc
    createdAt: string; // Thời gian tạo thông báo
    updatedAt: string; // Thời gian cập nhật thông báo
}
export interface userFollowInfo {
    _id: string;
    name: string;
    username: string;
    email: string;
    profilePic: string; // URL or empty string
    followers: string[]; // Array of user IDs
    following: string[]; // Array of user IDs
    isFrozen: boolean; // Indicates if the account is frozen
}