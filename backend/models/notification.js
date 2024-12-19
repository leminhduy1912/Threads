import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true, 
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true, 
		},
		type: {
			type: String,
			enum: [
				"like",
				"comment", 
				"reply", 
				"follow", 
				"message",
			],
			required: true,
		},
		content: {
			type: String, 
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post", 
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
