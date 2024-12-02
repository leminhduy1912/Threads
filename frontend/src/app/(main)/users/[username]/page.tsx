import clientRequest from "@/app/api/clientRequest";
import Loading from "@/app/loading";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserProfile from "@/components/userpage/UserProfile";
import { UserData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import UserPosts from "./UserPosts";


interface PageProps {
    params: { username: string };
}
export default async function Page({ params: { username } }: PageProps) {


    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <UserProfile username={username} postCount={7} />
                <UserPosts username={username} />
            </div>
            <TrendsSidebar />
        </main>
    );
}



