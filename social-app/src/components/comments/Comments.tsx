
// import { CommentsPage, PostData } from "@/lib/types";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { Button } from "../ui/button";
// import Comment from "./Comment";
// import CommentInput from "./CommentInput";
// import clientRequest from "@/app/api/clientRequest";
// import Loading from "@/app/loading";

// interface CommentsProps {
//   post: PostData;
// }

// export default function Comments({ post }: CommentsProps) {
//   const fetchComment = async ({ pageParam = 1 }) => {
//     const res = await clientRequest.get(`/api/posts/reply/${post._id}/comment?page=${pageParam}&limit=10`);
//     return res.data.replies; // Assuming the API response is the array of posts
//     console.log("comments", res.data.replies)
//   };

//   // Infinite query setup
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//   } = useInfiniteQuery({
//     queryKey: ["comment", post._id],
//     queryFn: fetchComment,
//     getNextPageParam: (lastPage, allPages) => {
//       // Determine if there is a next page
//       const currentPage = allPages.length;
//       return lastPage?.length === 10 ? currentPage + 1 : undefined;
//     },
//   });

//   // Flatten the posts array from all pages
//   const comments = data?.pages.flat() || [];
//   // Handle loading state
//   if (status === "pending") {
//     return <Loading />;
//   }

//   // Handle error state
//   if (status === "error") {
//     return <p className="text-center text-destructive">Failed to load comments.</p>;
//   }

//   // Handle case where there are no posts
//   if (status === "success" && comments.length === 0) {
//     return (
//       <p className="text-center text-muted-foreground">
//         No comment available.
//       </p>
//     );
//   }


//   return (
//     <div className="space-y-3">
//       <CommentInput post={post} />
//       {hasNextPage && (
//         <Button
//           variant="link"
//           className="mx-auto block"
//           disabled={isFetchingNextPage}
//           onClick={() => fetchNextPage()}
//         >
//           Load previous comments
//         </Button>
//       )}
//       {status === "pending" && <Loading />}
//       {status === "success" && !comments.length && (
//         <p className="text-center text-muted-foreground">No comments yet.</p>
//       )}
//       {status === "error" && (
//         <p className="text-center text-destructive">
//           An error occurred while loading comments.
//         </p>
//       )}
//       <div className="divide-y">
//         {comments.map((comment) => (


//           <Comment key={comment._id} comment={comment} />
//         ))}
//       </div>
//     </div>
//   );
// }
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import clientRequest from "@/app/api/clientRequest";
import Loading from "@/app/loading";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  // Hàm fetch comment cho từng bài viết
  const fetchComment = async ({ pageParam = 1 }) => {
    const res = await clientRequest.get(`/api/posts/reply/${post._id}/comment?page=${pageParam}&limit=10`);
    console.log("Fetched comments for post:", post._id, res.data.replies); // Debug
    return res.data.replies;
  };

  // Thiết lập Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comment", post._id], // Key riêng biệt cho từng bài viết
    queryFn: fetchComment,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return lastPage?.length === 10 ? currentPage + 1 : undefined;
    },
  });

  // Danh sách các comment từ nhiều trang
  const comments = data?.pages.flat() || [];

  // Trạng thái khi đang tải
  if (status === "loading") {
    return <Loading />;
  }

  // Trạng thái lỗi
  if (status === "error") {
    return <p className="text-center text-destructive">Failed to load comments.</p>;
  }

  // Trạng thái không có comment
  if (status === "success" && comments.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No comments available.
      </p>
    );
  }

  // Render giao diện comment
  return (
    <div className="space-y-3">
      {/* Form nhập comment */}
      <CommentInput post={post} />

      {/* Nút tải thêm comment */}
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load more comments"}
        </Button>
      )}

      {/* Danh sách các comment */}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
