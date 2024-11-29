"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import { UserData } from "@/lib/types";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}
export default function UserTooltip({ children, user }: UserTooltipProps) {

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.profilePic} />
              </Link>

            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.username}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>

          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
