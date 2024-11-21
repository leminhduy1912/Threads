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
		<div className="flex  items-start justify-between">
			<div className="flex-2">
				<Sidebar />
			</div>

			<div>

				<div className="pt-20 flex-3">
					{!loading && posts.length === 0 && (
						<h1 className="text-lg font-semibold">Follow some users to see the feed</h1>
					)}

					{loading && (
						<div className="flex justify-center">
							<Spinner size='xl' />
						</div>
					)}
					{posts.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</div>

			</div>
			<div className="  pt-20 flex-2">
				<SuggestedUsers />
			</div>
		</div>


	);
};

export default HomePage;




