import Notification from "../models/notification.js";
export const getNotifications = async (req,res) => {
    //const { user_id: userId } = req.params;
	const { _id: userId } = req.user;
	try {
		const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
		const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 phản hồi mỗi trang
        if (page < 1 || limit < 1) {
			return res.status(400).json({ message: "Page and limit must be positive numbers." });
		}
		const skip = (page - 1) * limit;
		const notifications = await Notification.find({ receiver: userId })
			.sort({ createdAt: -1 }) // Sort by latest first
			.skip(skip)
			.limit(limit)
			.populate("sender", "name profilePic") // Populate sender's name and profilePic
			.populate("post", "text img"); // Populate post details

            res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
};
export const markAsSeen = async (req,res) => {
    const { id: notiId } = req.params;
	try {
		const result = await Notification.updateMany(
			{ _id: { $in: notiId } }, // Match notifications by IDs
			{ $set: { isRead: true } } // Mark as read
		);
        res.status(200).json(result);
	} catch (error) {
        res.status(500).json({ error: err.message });
	}
};
export const createNotification = async (req, res) => {
	try {
		// Lấy dữ liệu từ req.body
		const { receiver, type, content, post, message } = req.body;
		const { _id: sender} = req.user;
		// Tạo thông báo mới
		const notification = new Notification({
			receiver,
			sender,
			type,
			content,
			post,
			message,
		});

		// Lưu vào cơ sở dữ liệu
		const result = await notification.save();

		// Trả về phản hồi
		res.status(201).json({ success: true, notification: result });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
// curl -X POST http://localhost:5000/notifications \
// -H "Content-Type: application/json" \
// -d '{
//     "receiver": "63f98b1234abcdef567890ab",
//     "sender": "63f98b5678abcdef567890cd",
//     "type": "like",
//     "content": "User A liked your post",
//     "post": "63f98c9876abcdef567890ef"
// }'

export const deleteNotification = async (req,res) => {
	try {
        const { id: notiId } = req.params;
		const result = await Notification.findByIdAndDelete(notiId);
		if (!result) {
            res.status(500).json({ success: false, message: error.message });

		}
		res.status(200).json({ success: true, message: "Deleted notification" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
