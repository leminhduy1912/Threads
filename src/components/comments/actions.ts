"use server";

import clientRequest from "@/app/api/clientRequest";
export async function submitComment({
    text,
    replyId,
    img,
    postId
}: {
    text: string;
    replyId: string; // Tùy chọn
    img: string;
    postId: string
}) {
    try {
        // if (replyId){

        // }
        const response = await clientRequest.put(
            `api/posts/reply/${postId}`,
            {
                text,
                replyId, // Nếu replyId không có, Axios sẽ tự bỏ qua
                img,
            }
        );
        return response.data; // Trả về dữ liệu từ server
    } catch (error: any) {
        console.error("Error submitting comment:", error?.response?.data || error);
        throw new Error(
            error?.response?.data?.message || "Failed to submit comment"
        );
    }
}

