
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
  const fetchComment = async ({ pageParam = 1 }) => {
    const res = await clientRequest.get(`/api/posts/reply/${post._id}/comment?page=${pageParam}&limit=10`);
    return res.data.replies; // Assuming the API response is the array of posts
  };
  // Infinite query setup
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comment-feed"],
    queryFn: fetchComment,
    getNextPageParam: (lastPage, allPages) => {
      // Determine if there is a next page
      const currentPage = allPages.length;
      return lastPage?.length === 10 ? currentPage + 1 : undefined;
    },
  });

  // Flatten the posts array from all pages
  const comments = data?.pages.flat() || [];
  console.log("comments", comments)
  // Handle loading state
  if (status === "pending") {
    return <Loading />;
  }

  // Handle error state
  if (status === "error") {
    return <p className="text-center text-destructive">Failed to load comments.</p>;
  }

  // Handle case where there are no posts
  if (status === "success" && comments.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No comment available.
      </p>
    );
  }


  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loading />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (


          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
