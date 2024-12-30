// "use client";

// import { SearchIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Input } from "./ui/input";
// import clientRequest from "@/app/api/clientRequest";
// import { FormEvent, useState } from "react";
// import Loading from "@/app/loading";
// import { useToast } from "@/hooks/use-toast";

// export default function SearchField() {
//   const [username, setUsername] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const router = useRouter();

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const trimmedUsername = username.trim();

//     if (!trimmedUsername) {
//       toast({
//         variant: "destructive",
//         title: "Empty Input",
//         description: "Please enter a username to search.",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await clientRequest.get(`/api/users/profile/${trimmedUsername}`);
//       if (response?.status === 200) {
//         router.push(`/users/${encodeURIComponent(trimmedUsername)}`);
//       }
//     } catch (error: any) {
//       if (error.response?.status === 404) {
//         toast({
//           variant: "destructive",
//           title: "User Not Found",
//           description: "Please enter a different username.",
//         });
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "An unexpected error occurred. Please try again later.",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//       setUsername("");
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loading />}
//       <form onSubmit={handleSubmit} className="relative">
//         <Input
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           name="username"
//           placeholder="Search"
//           className="pe-10"
//         />
//         <button
//           type="submit"
//           className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
//           disabled={isLoading} // Disable button while loading
//         >
//           <SearchIcon size={20} />
//         </button>
//       </form>
//     </>
//   );
// }
"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import clientRequest from "@/app/api/clientRequest";
import { FormEvent, useState } from "react";
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";

export default function SearchField() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast({
        variant: "destructive",
        title: "Empty Input",
        description: "Please enter a username to search.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await clientRequest.get(`/api/users/profile/${trimmedUsername}`);
      if (response?.status === 200) {
        toast({
          variant: "success",
          title: "User Found",
          description: `Redirecting to ${trimmedUsername}'s profile...`,
        });
        router.push(`/users/${encodeURIComponent(trimmedUsername)}`);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: "The username you entered does not exist. Please try a different username.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
      setUsername("");
    }
  };

  return (
    <>
      {isLoading && <Loading />} {/* Hiển thị hiệu ứng Loading */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          placeholder="Search"
          className="pe-10"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
          disabled={isLoading} // Disable button while loading
        >
          <SearchIcon size={20} />
        </button>
      </form>
    </>
  );
}
