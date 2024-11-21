// import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
// import userFollowUnfollow from "../hooks/userFollowUnfollow";
// import { Link } from "react-router-dom";


// const SuggestedUser = ({ user }) => {

//     const { handleFollowUnfollow, following, updating } = userFollowUnfollow(user);

//     return (
//         <Flex gap={2} justifyContent={"space-between"} alignItems={"center"} className="bg-slate-800 p-3  rounded-xl">
//             {/* left side */}
//             <Flex gap={2} as={Link} to={`${user.username}`} className="">
//                 <Avatar src={user.profilePic} />
//                 <Box flexDirection={"column"} justifyContent={"start"} alignItems={"start"} width={"10rem"}>
//                     <Text fontSize={"sm"} fontWeight={"bold"}>
//                         {user.username}
//                     </Text>
//                     <Text color={"gray.light"} fontSize={"sm"}>
//                         {user.name}
//                     </Text>
//                 </Box>
//             </Flex>
//             {/* right side */}
//             <Button
//                 size={"sm"}
//                 color={following ? "black" : "white"}
//                 bg={following ? "white" : "blue.400"}
//                 onClick={handleFollowUnfollow}
//                 isLoading={updating}
//                 _hover={{
//                     color: following ? "black" : "white",
//                     opacity: ".8",
//                 }}
//             >
//                 {following ? "Unfollow" : "Follow"}
//             </Button>
//         </Flex>
//     )
// }

// export default SuggestedUser
import { useState } from "react";
import { Link } from "react-router-dom";
import userFollowUnfollow from "../hooks/userFollowUnfollow";
import { Avatar } from "@chakra-ui/react";

const SuggestedUser = ({ user }) => {
    const { handleFollowUnfollow, following, updating } = userFollowUnfollow(user);

    return (
        <div className="flex items-center justify-between gap-2 bg-slate-600 p-3 rounded-2xl">
            {/* Left side */}
            <Link to={`${user.username}`} className="flex items-center gap-2">
                {/* <img
                    src={user.profilePic}
                    alt={`${user.username}'s profile`}
                    className="w-10 h-10 rounded-full"
                /> */}
                <Avatar src={user.profilePic} />
                <div className="flex flex-col justify-start items-start w-40">
                    <span className="text-sm font-bold text-white">{user.username}</span>
                    <span className="text-sm text-gray-400">{user.name}</span>
                </div>
            </Link>

            {/* Right side */}
            <button
                className={`px-3 py-1 text-sm font-medium rounded-md ${following
                    ? "bg-white text-black hover:opacity-80"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                onClick={handleFollowUnfollow}
                disabled={updating}
            >
                {updating ? "Processing..." : following ? "Unfollow" : "Follow"}
            </button>
        </div>
    );
};

export default SuggestedUser;
