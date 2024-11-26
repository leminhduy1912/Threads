import { CommentData } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { submitComment } from "./actions";



export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment(),
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      // Hủy các truy vấn đang hoạt động
      await queryClient.cancelQueries({ queryKey });

      // Cập nhật dữ liệu cache React Query
      queryClient.setQueryData<InfiniteData<CommentData, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
          return oldData;
        }
      );

      // Làm mới các query chưa có dữ liệu
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      // Hiển thị thông báo thành công
      toast({
        description: "Comment created",
      });
    },
    onError(error: any) {
      console.error(error);
      // Hiển thị thông báo lỗi
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

// export function useSubmitCommentMutation(postId: string) {
//   const { toast } = useToast();

//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: ({ content }: { content: string }) =>
//       submitComment({ postId, content }),
//     onSuccess: async (newComment) => {
//       const queryKey: QueryKey = ["comments", postId];

//       // Hủy các truy vấn đang hoạt động
//       await queryClient.cancelQueries({ queryKey });

//       // Cập nhật dữ liệu cache React Query
//       queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
//         queryKey,
//         (oldData) => {
//           const firstPage = oldData?.pages[0];

//           if (firstPage) {
//             return {
//               pageParams: oldData.pageParams,
//               pages: [
//                 {
//                   previousCursor: firstPage.previousCursor,
//                   comments: [...firstPage.comments, newComment],
//                 },
//                 ...oldData.pages.slice(1),
//               ],
//             };
//           }
//           return oldData;
//         }
//       );

//       // Làm mới các query chưa có dữ liệu
//       queryClient.invalidateQueries({
//         queryKey,
//         predicate(query) {
//           return !query.state.data;
//         },
//       });

//       // Hiển thị thông báo thành công
//       toast({
//         description: "Comment created",
//       });
//     },
//     onError(error: any) {
//       console.error(error);
//       // Hiển thị thông báo lỗi
//       toast({
//         variant: "destructive",
//         description: "Failed to submit comment. Please try again.",
//       });
//     },
//   });

//   return mutation;
// }


// export function useSubmitCommentMutation(postId: string) {
//   const { toast } = useToast();

//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: submitComment,
//     onSuccess: async (newComment) => {
//       const queryKey: QueryKey = ["comments", postId];

//       await queryClient.cancelQueries({ queryKey });

//       queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
//         queryKey,
//         (oldData) => {
//           const firstPage = oldData?.pages[0];

//           if (firstPage) {
//             return {
//               pageParams: oldData.pageParams,
//               pages: [
//                 {
//                   previousCursor: firstPage.previousCursor,
//                   comments: [...firstPage.comments, newComment],
//                 },
//                 ...oldData.pages.slice(1),
//               ],
//             };
//           }
//         },
//       );

//       queryClient.invalidateQueries({
//         queryKey,
//         predicate(query) {
//           return !query.state.data;
//         },
//       });

//       toast({
//         description: "Comment created",
//       });
//     },
//     onError(error) {
//       console.error(error);
//       toast({
//         variant: "destructive",
//         description: "Failed to submit comment. Please try again.",
//       });
//     },
//   });

//   return mutation;
// }

// export function useDeleteCommentMutation() {
//   const { toast } = useToast();

//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: deleteComment,
//     onSuccess: async (deletedComment) => {
//       const queryKey: QueryKey = ["comments", deletedComment.postId];

//       await queryClient.cancelQueries({ queryKey });

//       queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
//         queryKey,
//         (oldData) => {
//           if (!oldData) return;

//           return {
//             pageParams: oldData.pageParams,
//             pages: oldData.pages.map((page) => ({
//               previousCursor: page.previousCursor,
//               comments: page.comments.filter((c) => c.id !== deletedComment.id),
//             })),
//           };
//         },
//       );

//       toast({
//         description: "Comment deleted",
//       });
//     },
//     onError(error) {
//       console.error(error);
//       toast({
//         variant: "destructive",
//         description: "Failed to delete comment. Please try again.",
//       });
//     },
//   });

//   return mutation;
// }
