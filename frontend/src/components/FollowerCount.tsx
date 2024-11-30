"use client";

import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  count: string;
}

export default function FollowerCount({ count }: FollowerCountProps) {
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(Number(count))}</span>
    </span>
  );
}
