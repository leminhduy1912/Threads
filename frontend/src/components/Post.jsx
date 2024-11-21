import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
// import Actions from "./Actions";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { IoIosSend } from "react-icons/io";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { clientRequest } from "../api/clientRequest";
import { SwiperSlide, Swiper } from "swiper/react";
import 'swiper/css';
import Actions from "./Actions";
import Comments from "./Comments";
import ImageSlide from "./ImageSlide";
import { BsFillImageFill } from "react-icons/bs";
import { CloseButton } from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";



const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);

	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [commentContent, setCommentContent] = useState("");

	const [imgs, setImgs] = useState(post.img);
	const navigate = useNavigate();
	const [isOpenComment, setIsOpenComment] = useState(false);
	const [isLiking, setIsLiking] = useState(false);
	const [liked, setLiked] = useState(post.likes.includes(user?._id));
	const { imgUrl, setImgUrl, removeImage } = usePreviewImg();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await clientRequest("/api/users/profile/" + postedBy);
				const data = await res.data;
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);


	const handleDeletePost = async (e) => {
		console.log("delete post")
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await clientRequest.delete(`/api/posts/${post._id}`);
			const data = await res.data;
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	const handleLikeAndUnlike = async () => {
		if (!user) {
			return showToast("Error", "You must be logged in to like a post", "error");
		}
		if (isLiking) return;
		setIsLiking(true);

		try {
			// Make the PUT request
			const res = await clientRequest.put("/api/posts/like/" + post._id);
			console.log("res", res)
			// Handle non-200 responses
			if (!res) {
				const errorData = await res.data;
				return showToast("Error", errorData.error || "An error occurred", "error");
			}

			const data = await res.data; // Parse the JSON if needed

			if (data.error) {
				return showToast("Error", data.error, "error");
			}

			// Toggle the liked state in the UI
			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					// If liked, add user to likes, otherwise remove them
					const updatedLikes = liked
						? p.likes.filter((id) => id !== user._id)
						: [...p.likes, user._id];

					return { ...p, likes: updatedLikes };
				}
				return p;
			});

			setPosts(updatedPosts);
			setLiked(!liked); // Toggle the liked state

		} catch (error) {
			showToast("Error", error.message || "An error occurred", "error");
		} finally {
			setIsLiking(false);
		}
	};
	const [imagePreview, setImagePreview] = useState(null);
	const imageRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result); // Set the preview image
			};
			reader.readAsDataURL(file);
		} else {
			alert("Please select a valid image file");
		}
	};
	const handleRemoveImage = () => {
		setImagePreview(null)
	}
	if (!user) { return null };
	const handleShowComment = () => {
		setIsOpenComment((prevState) => !prevState); // Đảo ngược trạng thái

	}

	return (
		// < !--Wrapper-- >
		<div className="wrapper pt-10 px-8 flex flex-col items-center w-[1400px] ">
			{/* <!-- Card--> */}
			<article className="mb-4 break-inside p-6 rounded-xl bg-white dark:bg-slate-800 flex flex-col justify-between bg-clip-border sm:w-3/6 w-full ">
				<div className="flex pb-6 items-center justify-between">
					<div className="flex">
						<a className="inline-block mr-4" href="#">
							<img className="rounded-full max-w-none w-12 h-12" src="https://randomuser.me/api/portraits/men/35.jpg" />
						</a>
						<div className="flex flex-col justify-start items-start">
							<div>
								<div className="inline-block  text-lg font-bold dark:text-white cursor-pointer"
									onClick={(e) => {
										e.preventDefault();
										navigate(`/${user.username}`);
									}}
								>{user?.username}</div>
							</div>
							<div className="text-slate-500 dark:text-slate-400">
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-3xl text-start font-normal dark:text-white" >
					{post.text}
				</h2>
				{/* image slider */}
				<div className="h-full w-full flex justify-center items-center ">
					{
						imgs && imgs.length > 0 && (
							<div className="py-4 w-full">
								<div className=""><ImageSlide imgs={imgs} /></div>
							</div>
						)
					}

				</div>




				<div className="py-4 flex justify-items-start gap-5">
					<div className="inline-flex items-center" href="#">
						<span className="mr-2">

							<svg
								aria-label='Like'
								color={liked ? "rgb(237, 73, 86)" : ""}
								fill={liked ? "rgb(237, 73, 86)" : "transparent"}
								height='19'
								role='img'
								viewBox='0 0 24 22'
								width='20'
								onClick={handleLikeAndUnlike}
							>
								<path
									d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
									stroke='currentColor'
									strokeWidth='2'
								></path>
							</svg>
						</span>

						<span className="text-lg font-bold">{post.likes.length}</span>
					</div>
					<div className="inline-flex items-center" href="#">
						<span className="mr-2">

							<svg
								aria-label='Comment'
								color=''
								fill=''
								height='20'
								role='img'
								viewBox='0 0 24 24'
								width='20'
								onClick={handleShowComment}
							>
								<title>Comment</title>
								<path
									d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
									fill='none'
									stroke='currentColor'
									strokeLinejoin='round'
									strokeWidth='2'
								></path>
							</svg>
						</span>

						<span className="text-lg font-bold">{post.replies.length}</span>
					</div>
				</div>
				<div
					className="relative w-full h-auto bg-slate-100 dark:bg-slate-600 rounded-lg p-3 placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium"
					style={{ minHeight: "100px" }}
				>

					<input
						className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 dark:bg-slate-600 rounded-lg placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium pr-20"
						type="text" placeholder="Write a comment" />

					{/* Display the image preview if available */}
					{imagePreview && (
						<div className="relative">
							<img
								src={imagePreview}
								alt="Preview"
								className="rounded-lg object-cover mt-2"
								style={{ maxWidth: "100%", maxHeight: "150px" }}
							/>
							<CloseButton
								onClick={() => handleRemoveImage()}  // Xóa ảnh khi bấm nút
								bg={"gray.800"}
								position={"absolute"}
								top={2}
								left={2}
							/>
						</div>
					)}

					{/* Hidden file input */}
					<input
						type="file"
						ref={imageRef}
						accept="image/*"
						style={{ display: "none" }}
						onChange={handleImageChange}
					/>

					{/* Image upload button */}
					<div className="absolute  top-6 right-6 flex justify-start gap-2 items-center"
					>
						<span
							className=" cursor-pointer text-gray-500 dark:text-gray-300"
							onClick={() => imageRef.current.click()} // Trigger file input
						>
							<BsFillImageFill size={20} />
						</span>
						<span
							className="cursor-pointer text-gray-500 dark:text-gray-300"
							onClick={() => imageRef.current.click()} // Trigger file input
						>
							<IoIosSend size={20} />
						</span>
					</div>

				</div>

				<div className="">{
					isOpenComment && post.replies.length > 0 && post.replies.map((item, index) => {
						return (
							<Comments reply={item} />
						)
					})
				}</div>



			</article>
		</div >
		// <!--End Wrapper-- >

	);
};

export default Post;