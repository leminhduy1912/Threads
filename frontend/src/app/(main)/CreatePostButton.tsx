"use client";

import { Button } from "@/components/ui/button";
import { PostData, UserData } from "@/lib/types";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

//import EditProfileDialog from "./EditProfileDialog";



export default function CreatePostButton() {


    return (
        <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="Messages"
            asChild
        >
            <Link href="/create-post">
                <div className="relative">
                    <SquarePlus />

                </div>
                <span className="hidden lg:inline">Create Post</span>
            </Link>
        </Button>
    );
}