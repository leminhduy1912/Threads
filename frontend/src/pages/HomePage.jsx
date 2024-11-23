import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { clientRequest } from "../api/clientRequest";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
const HomePage = () => {
	return (
		<div className="flex items-start justify-between w-full ">
			<Sidebar className="w-[20%]" />
			<Posts className="w-[60%]" />
			<SuggestedUsers className="w-[20%]" />
		</div>
	);
};

export default HomePage;




