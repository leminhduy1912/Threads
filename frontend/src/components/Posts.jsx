// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import useShowToast from "../hooks/useShowToast";
// import { clientRequest } from "../api/clientRequest";
// import postsAtom from "../atoms/postsAtom";
// import { Spinner } from "@chakra-ui/react";
// import Post from "./Post";


// const Posts = () => {
//     const [posts, setPosts] = useRecoilState(postsAtom);
//     const [loading, setLoading] = useState(true);
//     const showToast = useShowToast();
//     useEffect(() => {
//         const getFeedPosts = async () => {
//             setLoading(true);
//             setPosts([]);
//             try {
//                 const res = await clientRequest(`/api/posts/feed`);
//                 const data = await res.data;
//                 if (data.error) {
//                     showToast("Error", data.error, "error");
//                     return;
//                 }

//                 setPosts(data);
//             } catch (error) {
//                 showToast("Error", error.message, "error");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getFeedPosts();
//     }, [showToast, setPosts]);

//     return (

//         <div className="pt-20 flex-3">
//             {!loading && posts.length === 0 && (
//                 <h1 className="text-lg font-semibold">Follow some users to see the feed</h1>
//             )}

//             {loading && (
//                 <div className="flex justify-center">
//                     <Spinner size='xl' />
//                 </div>
//             )}
//             {posts.map((post) => (
//                 <Post key={post._id} post={post} postedBy={post.postedBy} getFeedPost={getFeedPost} />
//             ))}
//         </div>
//     )
// }

// export default Posts
import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import { clientRequest } from "../api/clientRequest";
import postsAtom from "../atoms/postsAtom";
import { Spinner } from "@chakra-ui/react";
import Post from "./Post";

const Posts = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();

    const getFeedPosts = useCallback(async () => {
        setLoading(true);
        setPosts([]);
        try {
            const res = await clientRequest(`/api/posts/feed`);
            const data = res.data;
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
    }, [setPosts, showToast]);

    useEffect(() => {
        getFeedPosts();
    }, [getFeedPosts]);

    return (
        <div className="pt-20">
            {!loading && posts.length === 0 && (
                <h1 className="text-lg font-semibold">Follow some users to see the feed</h1>
            )}

            {loading && (
                <div className="flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} getFeedPosts={getFeedPosts} />
            ))}
        </div>
    );
};

export default Posts;
