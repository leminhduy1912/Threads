import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true, // Người nhận thông báo
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true, // Người gây ra hành động (like, comment, etc.)
		},
		type: {
			type: String,
			enum: [
				"like", // Thông báo khi bài viết được thích
				"comment", // Thông báo khi có bình luận
				"reply", // Thông báo khi có trả lời tin nhắn
				"follow", // Thông báo khi có người theo dõi
				"message", // Thông báo khi nhận tin nhắn
			],
			required: true,
		},
		content: {
			type: String, // Nội dung tùy chọn (ví dụ: "User A đã thích bài viết của bạn")
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post", // Liên kết với bài viết nếu thông báo liên quan đến bài viết
		},
		message: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message", // Liên kết với tin nhắn nếu thông báo liên quan đến tin nhắn
		},
		isRead: {
			type: Boolean,
			default: false, // Trạng thái đọc thông báo
		},
	},
	{
		timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
	}
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
