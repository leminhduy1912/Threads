"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";


export default function FollowingFeed() {

    return (
        <InfiniteScrollContainer
            className="space-y-5"
            //onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
            onBottomReached={() => { }}

        >
            {/* {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />} */}
        </InfiniteScrollContainer>
    );
}