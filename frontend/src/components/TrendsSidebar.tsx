
// "use client"
// import { Loader2 } from "lucide-react";
// import Link from "next/link";
// import { Suspense, useEffect, useState } from "react";
// import FollowButton from "./FollowButton";
// import UserAvatar from "./UserAvatar";
// import UserTooltip from "./UserTooltip";
// import clientRequest from "@/app/api/clientRequest";

// export default function TrendsSidebar() {

//   return (
//     <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
//       <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
//         <WhoToFollow />

//       </Suspense>
//     </div>
//   );
// }

// export function WhoToFollow() {
//   const [listSuggestedUser, setListSuggestedUser] = useState([])
//   useEffect(() => {
//     const getSuggestedUser = async () => {
//       try {
//         const res = await clientRequest("/api/users/suggested");
//         const data = await res.data;
//         setListSuggestedUser(data)
//         if (data.error) {
//           return;
//         }
//       } catch (error) {
//         console.log("error", error)
//       }
//     };
//     getSuggestedUser();
//   }, []);


//   return (
//     <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
//       <div className="text-xl font-bold">Who to follow</div>
//       {listSuggestedUser.map((user) => (

//         <div key={user.id} className="flex items-center justify-between gap-3">
//           <UserTooltip user={user}>
//             <Link
//               href={`/users/${user.username}`}
//               className="flex items-center gap-3"
//             >
//               <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
//               <div>
//                 <p className="line-clamp-1 break-all font-semibold hover:underline">
//                   {user.username}
//                 </p>

//               </div>
//             </Link>
//           </UserTooltip>
//           <FollowButton user={user} />
//         </div>

//       ))}

//     </div >
//   );
// }
"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";
import clientRequest from "@/app/api/clientRequest";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
      </Suspense>
    </div>
  );
}

export function WhoToFollow() {
  const [listSuggestedUser, setListSuggestedUser] = useState([]);

  const getSuggestedUser = async () => {
    try {
      const res = await clientRequest("/api/users/suggested");
      const data = await res.data;
      setListSuggestedUser(data);
      if (data.error) {
        return;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getSuggestedUser();
  }, []);

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {listSuggestedUser.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          {/* Pass getSuggestedUser to FollowButton */}
          <FollowButton user={user} getSuggestedUser={getSuggestedUser} />
        </div>
      ))}
    </div>
  );
}
