"use client";

// import useFollowerInfo from "@/hooks/useFollowerInfo";
// import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

// interface FollowerCountProps {
//   // userId: string;
//   // initialState: FollowerInfo;
// }

export default function FollowerCount() {
  // const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(7)}</span>
    </span>
  );
}
