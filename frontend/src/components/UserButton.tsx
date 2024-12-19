'use client';

import { cn } from "@/lib/utils";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import clientRequest from "@/app/api/clientRequest";
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme(); // Theme handling

  const [user, setUser] = useState(null); // Initialize user state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await clientRequest.post("api/users/logout");
      if (response.data) {
        queryClient.clear();
        localStorage.clear();
        router.push("/login");
        toast({
          variant: "success",
          title: "Logout Successfully",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user-threads");
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(parsedUser);
      if (!parsedUser) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return null; // Avoid rendering until user state is resolved
  }

  return (
    <>
      {isLoading && <Loading />} {/* Show loading indicator */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn("flex-none rounded-full", className)}>
            <UserAvatar avatarUrl={user.profilePic || ""} size={40} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{`Logged in as ${user.username || "Guest"}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/users/${user.username}`}>
            <DropdownMenuItem>
              <UserIcon className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Monitor className="mr-2 size-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 size-4" />
                  System default
                  {theme === "system" && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 size-4" />
                  Light
                  {theme === "light" && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 size-4" />
                  Dark
                  {theme === "dark" && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOutIcon className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
