"use client";

import { Button } from "@/components/ui/button";
// import kyInstance from "@/lib/ky";
// // import { MessageCountInfo } from "@/lib/types";
// import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";

// interface MessagesButtonProps {
//     initialState: MessageCountInfo;
// }

export default function MessagesButton() {
    // const { data } = useQuery({
    //     queryKey: ["unread-messages-count"],
    //     queryFn: () =>
    //         kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    //     initialData: initialState,
    //     refetchInterval: 60 * 1000,
    // });

    return (
        <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="Messages"
            asChild
        >
            <Link href="/messages">
                <div className="relative">
                    <Mail />

                </div>
                <span className="hidden lg:inline">Messages</span>
            </Link>
        </Button>
    );
}