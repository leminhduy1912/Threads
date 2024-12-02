
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
    queryKey: ["comments", post._id], // Key riêng biệt cho từng bài viết
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
      <div className="space-y-3">
        <CommentInput post={post} />
        <p className="text-center text-muted-foreground">
          No comments available.
        </p>
      </div>

    );
  }

  // Render giao diện comment
  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {/* load more button */}
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
