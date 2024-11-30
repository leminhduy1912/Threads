

import mongoose  from "mongoose";
const conversationSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			default: () => new mongoose.Types.ObjectId(),
		},
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		userPic: { type: String },
		text: { type: String },
		username:{type:String},
		image: { type: String },
	},
	{
		timestamps: true, // Timestamps for each conversation entry
	}
);

const replySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			text: { type: String },
			image: { type: String },
		},
		conversation: [conversationSchema], // Embed conversation schema
		userProfilePic: {
			type: String,
		},
		username: {
			type: String,
		},
	},
	{
		timestamps: true, // Timestamps for each reply
	}
);

const postSchema = new mongoose.Schema(
	{
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			maxLength: 500,
		},
		isLiked:{
			type:Boolean,
			default: false
		},
		img: {
			type: String,
		},
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		replies: [replySchema], // Embed reply schema
	},
	{
		timestamps: true, // Timestamps for each post
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;