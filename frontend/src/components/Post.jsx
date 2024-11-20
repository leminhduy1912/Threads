import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
// import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { clientRequest } from "../api/clientRequest";
import { SwiperSlide, Swiper } from "swiper/react";
import 'swiper/css';
import Actions from "./Actions";
import Comments from "./Comments";

const Post = ({ post, postedBy }) => {

	const [user, setUser] = useState(null);

	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [imgs, setImgs] = useState(post.img);
	const navigate = useNavigate();
	const [isOpenComment, setIsOpenComment] = useState(false);
	const [isLiking, setIsLiking] = useState(false);
	const [liked, setLiked] = useState(post.likes.includes(user?._id));

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
	if (!user) { return null };
	// return (

	// 	<Flex gap={3} mb={4} py={5} width={500} height={500}  >

	// 		<Flex flexDirection={"column"} alignItems={"center"} >
	// 			<Avatar
	// 				size='md'
	// 				name={user.name}
	// 				src={user?.profilePic}
	// 				onClick={(e) => {
	// 					e.preventDefault();
	// 					navigate(`/${user.username}`);
	// 				}}
	// 			/>

	// 			<Box position={"relative"} w={"full"}>

	// 				{post.replies[0] && (
	// 					<Avatar
	// 						size='xs'
	// 						name='John doe'
	// 						src={post.replies[0].userProfilePic}
	// 						position={"absolute"}
	// 						top={"0px"}
	// 						left='15px'
	// 						padding={"2px"}
	// 					/>
	// 				)}

	// 				{post.replies[1] && (
	// 					<Avatar
	// 						size='xs'
	// 						name='John doe'
	// 						src={post.replies[1].userProfilePic}
	// 						position={"absolute"}
	// 						bottom={"0px"}
	// 						right='-5px'
	// 						padding={"2px"}
	// 					/>
	// 				)}

	// 				{post.replies[2] && (
	// 					<Avatar
	// 						size='xs'
	// 						name='John doe'
	// 						src={post.replies[2].userProfilePic}
	// 						position={"absolute"}
	// 						bottom={"0px"}
	// 						left='4px'
	// 						padding={"2px"}
	// 					/>
	// 				)}
	// 			</Box>
	// 		</Flex>
	// 		<Flex flex={1} flexDirection={"column"} alignContent={"start"} gap={2}>
	// 			<Flex justifyContent={"space-between"} w={"full"}>
	// 				<Flex w={"full"} alignItems={"center"}>
	// 					<Text
	// 						fontSize={"sm"}
	// 						fontWeight={"bold"}
	// 						onClick={(e) => {
	// 							e.preventDefault();
	// 							navigate(`/${user.username}`);
	// 						}}
	// 					>
	// 						{user?.username}
	// 					</Text>
	// 					{/* <Image src='/verified.png' w={4} h={4} ml={1} /> */}
	// 				</Flex>
	// 				<Flex gap={4} alignItems={"center"}>
	// 					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
	// 						{formatDistanceToNow(new Date(post.createdAt))} ago
	// 					</Text>

	// 					{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
	// 				</Flex>
	// 			</Flex>

	// 			<Text fontSize={"sm"} textAlign="start">{post.text}</Text>
	// 			<Flex align="center" justify="center">
	// 				{imgs.length > 0 && (
	// 					<Swiper
	// 						spaceBetween={10}
	// 						slidesPerView={1}
	// 						navigation
	// 						pagination={{
	// 							clickable: true,
	// 							type: 'fraction',  // Use fraction type for pagination
	// 							renderFraction: function (currentClass, totalClass) {
	// 								return `<span className="${currentClass}"></span> / <span className="${totalClass}"></span>`;
	// 							}
	// 						}}
	// 						// modules={[Pagination]}  // Register Pagination module
	// 						style={{ width: "500px", height: "250px" }}
	// 					>
	// 						{imgs.map((item, index) => (
	// 							<SwiperSlide key={index}>
	// 								<Box position="relative" width="250px" height="250px" onClick={(e) => e.preventDefault()}>  {/* Prevent default navigation */}

	// 									<span style={{
	// 										position: "absolute",
	// 										top: "10px",
	// 										right: "10px",
	// 										backgroundColor: "rgba(0, 0, 0, 0.5)",
	// 										color: "white",
	// 										padding: "5px 10px",
	// 										borderRadius: "5px",
	// 										fontSize: "12px"
	// 									}}>
	// 										{`${index + 1}/${imgs.length}`}
	// 									</span>
	// 									<img
	// 										src={item}
	// 										alt={`Slide ${index + 1}`}
	// 										style={{
	// 											width: "100%",
	// 											height: "100%",
	// 											objectFit: "cover",
	// 											borderRadius: "10px",
	// 										}}
	// 									/>
	// 								</Box>
	// 							</SwiperSlide>
	// 						))}
	// 					</Swiper>
	// 				)}
	// 			</Flex>

	// 			<Flex gap={3} my={1}>
	// 				<Actions post={post} />
	// 			</Flex>
	// 		</Flex>
	// 	</Flex>

	const handleShowComment = () => {
		setIsOpenComment(!isOpenComment)

		console.log("open comment")
	}
	return (
		// < !--Wrapper-- >
		<div className="wrapper pt-10 px-8 flex flex-col items-center">
			{/* <!-- Card--> */}
			<article className="mb-4 break-inside p-6 rounded-xl bg-white dark:bg-slate-800 flex flex-col bg-clip-border sm:w-3/6 w-full">
				<div className="flex pb-6 items-center justify-between">
					<div className="flex">
						<a className="inline-block mr-4" href="#">
							<img className="rounded-full max-w-none w-12 h-12" src="https://randomuser.me/api/portraits/men/35.jpg" />
						</a>
						<div className="flex flex-col justify-start">
							<div>
								<div className="inline-block text-lg font-bold dark:text-white"
									onClick={(e) => {
										e.preventDefault();
										navigate(`/${user.username}`);
									}}
								>{user?.username}</div>
							</div>
							<div className="text-slate-500 dark:text-slate-400">
								July 17, 2018
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-3xl text-start font-extrabold dark:text-white" >
					Web Design templates Selection
				</h2>

				<div className="py-4">
					<div className="flex justify-between gap-1 mb-1">
						<a className="flex" href="#">
							<img className="max-w-full rounded-tl-lg"
								src="https://images.pexels.com/photos/92866/pexels-photo-92866.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
						</a>

					</div>

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

						<span className="text-lg font-bold">7</span>
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

						<span className="text-lg font-bold">34</span>
					</div>
				</div>
				<div className="relative">
					<input
						className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 dark:bg-slate-600 rounded-lg placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium pr-20"
						type="text" placeholder="Write a comment" />
					<span className="flex absolute right-3 top-2/4 -mt-3 items-center">

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
				</div>
				{/* <!-- Comments content --> */}
				{
					isOpenComment && (
						<Comments />
					)
				}


			</article>
		</div >
		// <!--End Wrapper-- >

	);
};

export default Post;