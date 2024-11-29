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
          <Link href={`/users/${user.username}`}>
            {/* <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} /> */}
          </Link>
        </UserTooltip>

        <UserTooltip user={user}>
          <Link href={`/users/test`}>
            <UserAvatar avatarUrl="https://th.bing.com/th/id/OIP.1mSyfMp-r01kxBYitbubbAHaHa?w=191&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7" />
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
