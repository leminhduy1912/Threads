"use client"
import React from 'react'
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Loading from "../../loading"
import { Loader2 } from 'lucide-react';
import Notification from './Notification';
import { useInfiniteQuery } from '@tanstack/react-query';
import clientRequest from '@/app/api/clientRequest';
const Notifications = () => {
    const fetchNotification = async ({ pageParam = 1 }) => {
        const res = await clientRequest.get(`/api/notifications?page=${pageParam}&limit=10`);
        return res.data; // Assuming the API response is the array of posts
    };
    // Infinite query setup
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotification,
        getNextPageParam: (lastPage, allPages) => {
            // Determine if there is a next page
            const currentPage = allPages.length;
            return lastPage?.length === 10 ? currentPage + 1 : undefined;
        },
    });
    // Flatten the posts array from all pages
    const notifications = data?.pages.flat() || [];

    // Handle loading state
    if (status === "pending") {
        return <Loading />;
    }

    // Handle error state
    if (status === "error") {
        return <p className="text-center text-destructive">Failed to load Notification.</p>;
    }

    // Handle case where there are no posts
    if (status === "success" && notifications.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No notification available.
            </p>
        );
    }
    return (
        <InfiniteScrollContainer
            className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        >
            {notifications.map((notification) => (
                <Notification key={notification.id} notification={notification} />
            ))}
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
        </InfiniteScrollContainer>
    )
}

export default Notifications