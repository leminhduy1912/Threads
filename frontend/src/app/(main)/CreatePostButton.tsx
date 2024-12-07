"use client";

import { Button } from "@/components/ui/button";
import { PostData, UserData } from "@/lib/types";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreatePostDialog from "./create-post/CreatePostDialog";

//import EditProfileDialog from "./EditProfileDialog";



export default function CreatePostButton() {

    const [showDialog, setShowDialog] = useState(false);
    return (
        <>

            <Button
                variant="ghost"
                className="flex items-center justify-start gap-3"
                title="Messages"
                asChild
                onClick={() => setShowDialog(true)}
            >
                <div>


                    <div className="relative">
                        <SquarePlus />

                    </div>
                    <span className="hidden lg:inline">Create Post</span>
                </div>
            </Button>
            <CreatePostDialog
                //user={user}
                open={showDialog}
                onOpenChange={setShowDialog}

            />
        </>

    );
}