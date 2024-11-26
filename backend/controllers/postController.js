import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getPublicIdFromUrl } from "../utils/getPublicIdOfImage.js";
import mongoose from "mongoose";
const createPost = async (req, res) => {
	try {
		const { postedBy, text, img } = req.body;

		// Validate required fields
		if (!postedBy || !text) {
			return res.status(400).json({ error: "PostedBy and text fields are required." });
		}

		// Check if the user exists
		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// Verify if the logged-in user is authorized to create the post
		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post." });
		}

		// Validate text length
		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters.` });
		}

		// Process the image (if provided)
		let uploadedImageUrl = null;
		if (img) {
			try {
				const uploadedResponse = await cloudinary.uploader.upload(img, {
					folder: "Threads",
					use_filename: false,
					unique_filename: true,
				});
				uploadedImageUrl = uploadedResponse.secure_url;
			} catch (uploadError) {
				return res.status(500).json({ error: "Image upload failed." });
			}
		}

		// Create the new post
		const newPost = new Post({
			postedBy,
			text,
			img: uploadedImageUrl, // Use the uploaded image URL or null
		});
		await newPost.save();

		// Respond with the newly created post
		return res.status(201).json(newPost);
	} catch (err) {
		// Handle unexpected server errors
		console.error(err);
		return res.status(500).json({ error: "An error occurred while creating the post." });
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		console.log(Array.isArray(post.img)); // Kiểm tra post.img có phải là mảng không

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			for (let url of post.img) {
			  console.log("public image ", url);
			   let  imgId = getPublicIdFromUrl(url);
			  console.log("public image id", imgId);
			   await cloudinary.uploader.destroy(imgId);
			}
		  }
		  

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const deleteReplyOrConversation = async (req, res) => {
	try {
		const { replyId, conversationId } = req.body; 
		const postId = req.params.id;
		const userId = req.user._id;

		// Tìm bài viết theo postId
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Nếu không có conversationId, xóa reply
		if (!conversationId) {
			console.log("Deleting a reply...");
			const replyIndex = post.replies.findIndex((r) => r._id.toString() === replyId);

			if (replyIndex === -1) {
				return res.status(404).json({ message: "Reply not found" });
			}
			post.replies.splice(replyIndex, 1);
		} else {
			console.log("Deleting a conversation inside a reply...");
			const reply = post.replies.find((r) => r._id.toString() === replyId);

			if (!reply) {
				return res.status(404).json({ message: "Reply not found" });
			}

			const conversationIndex = reply.conversation.findIndex((c) => c._id.toString() === conversationId);

			if (conversationIndex === -1) {
				return res.status(404).json({ message: "Conversation not found" });
			}


			// Xóa conversation
			reply.conversation.splice(conversationIndex, 1);
		}

		await post.save();

		// Trả về phản hồi thành công
		res.status(200).json({ message: "Deleted successfully", post });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};


const replyToPost = async (req, res) => {
	try {
	  const { id: postId } = req.params;
	  const { _id: userId, profilePic: userProfilePic, username } = req.user;
	  const { text, img, replyId } = req.body;
  
	  // Find the post by ID
	  const post = await Post.findById(postId);
  
	  if (!post) {
		return res.status(404).json({ message: "Post not found" });
	  }
  
	  // Prepare the payload for the reply
	  const payload = {};
	  if (text) payload.text = text;
  
	  // Handle image upload if provided
	  if (img) {
		const uploadedResponse = await cloudinary.uploader.upload(img, {
		  folder: "Threads",
		  use_filename: false,
		  unique_filename: true,
		});
		payload.image = uploadedResponse.secure_url;
	  }
  
	  let newReplyOrConversation;
  
	  if (!replyId) {
		// New reply
		const newReply = {
		  userId,
		  content: payload,
		  userProfilePic,
		  username,
		  conversation: [],
		};
		console.log("reply", newReply.content);
  
		// Add the reply to the post
		post.replies.push(newReply);
  
		// Store the newly created reply
		newReplyOrConversation = post.replies[post.replies.length - 1];
	  } else {
		// Reply to an existing reply (conversation)
		const reply = post.replies.find((r) => r._id.toString() === replyId);
  
		if (!reply) {
		  return res.status(404).json({ message: "Reply not found" });
		}
  
		const newConversation = {
		  _id: new mongoose.Types.ObjectId(),
		  userId,
		  userPic: userProfilePic,
		  text: payload.text,
		  username,
		  image: payload.image,
		};
		console.log("conversation", newConversation.text, newConversation.image);
  
		// Add the conversation to the reply
		reply.conversation.push(newConversation);
  
		// Store the newly created conversation
		newReplyOrConversation = reply.conversation[reply.conversation.length - 1];
	  }
  
	  // Save the updated post
	  await post.save();
  
	  // Return only the newly created reply or conversation
	  res.status(200).json({  newReplyOrConversation });
	} catch (error) {
	  console.error("Error:", error);
	  res.status(500).json({ message: "Server error" });
	}
  };
  
  
  const getCommentOfPost = async (req, res) => {
	try {
		const { id: postId } = req.params;

		// Lấy giá trị page và limit từ query, gán mặc định nếu không tồn tại
		const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
		const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 phản hồi mỗi trang

		if (page < 1 || limit < 1) {
			return res.status(400).json({ message: "Page and limit must be positive numbers." });
		}

		// Tìm bài viết theo ID
		const post = await Post.findById(postId).select("replies"); // Chỉ lấy mảng replies
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Lấy replies theo pagination
		const totalReplies = post.replies.length; // Tổng số replies
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		const paginatedReplies = post.replies.slice(startIndex, endIndex); // Phân trang mảng replies

		res.status(200).json({
			message: "Replies fetched successfully",
			page,
			limit,
			totalReplies,
			totalPages: Math.ceil(totalReplies / limit),
			replies: paginatedReplies,
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Server error" });
	}
};


const getFeedPosts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) ; // Mặc định là trang 1
		const limit = parseInt(req.query.limit); // Mặc định là 10 tài liệu mỗi trang

		const skip = (page - 1) * limit;
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 }).skip(skip).limit(limit);

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts ,deleteReplyOrConversation,getCommentOfPost};