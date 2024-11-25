const notificationSchema = new mongoose.Schema(
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