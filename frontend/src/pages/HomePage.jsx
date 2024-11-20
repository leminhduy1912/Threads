import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { clientRequest } from "../api/clientRequest";
import Sidebar from "../components/Sidebar";


const HomePage = () => {

	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await clientRequest(`/api/posts/feed`);
				const data = await res.data;
				console.log("data feed", data);
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		// <Flex gap={10} align="start" justify="space-between">
		// 	<Sidebar />
		// 	<Box>
		// 		{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

		// 		{loading && (
		// 			<Flex justify='center'>
		// 				<Spinner size='xl' />
		// 			</Flex>
		// 		)}

		// 		{posts.map((post) => {
		// 			return (
		// 				<Post key={post._id} post={post} postedBy={post.postedBy} />
		// 			);
		// 		})}

		// 	</Box>
		// 	<Box
		// 		display={{
		// 			base: "none",
		// 			md: "block",
		// 		}}
		// 	>
		// 		<SuggestedUsers />
		// 	</Box>
		// </Flex>
		<div className="flex gap-10 items-start justify-between">
			<Sidebar />
			<div>

				<div className="pt-20 flex-2">
					{!loading && posts.length === 0 && (
						<h1 className="text-lg font-semibold">Follow some users to see the feed</h1>
					)}

					{loading && (
						<div className="flex justify-center">
							<div className="spinner-border animate-spin w-10 h-10 border-4 rounded-full"></div>
						</div>
					)}
					{posts.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</div>

			</div>
			<div className="hidden md:block pt-20 flex-1">
				<SuggestedUsers />
			</div>
		</div>


	);
};

export default HomePage;




