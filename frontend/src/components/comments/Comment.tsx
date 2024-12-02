import { CommentData, UserData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";
import { formatDistanceToNow } from "date-fns"
interface CommentProps {
  comment: CommentData;

}

export default function Comment({ comment }: CommentProps) {
  const user: UserData = {
    _id: comment.userId,
    username: comment.username,
    name: comment.username,
    profilePic: comment.userProfilePic,
  };

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">

        <UserTooltip user={user}>
          <Link href={`/users/test`}>
            <UserAvatar avatarUrl={user.profilePic} />
          </Link>
        </UserTooltip>
      </span>
      {/* Comment content */}
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="font-medium hover:underline"
            >
              {user.username}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatDistanceToNow(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content.text}</div>
        {comment.content.image && (
          <div><img className="w-[200px] h-[200px] object-cover border rounded-sm" src={comment.content.image} alt="" /></div>

        )}
      </div>
      {/* {user._id == "673bff34eb1c86048f1fbabb" && (
        <CommentMoreButton
          username={user.username}
          createdAt={comment.createdAt}
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )} */}
    </div>
  );
}
