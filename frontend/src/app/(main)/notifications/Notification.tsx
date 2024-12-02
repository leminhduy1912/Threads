import { NotificationData } from '@/lib/types';
import { Heart, MessageCircle, User2 } from 'lucide-react';
import React from 'react'
import Link from "next/link";
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';

interface NotificationProps {
    notification: NotificationData;
}
type NotificationType = "follow" | "comment" | "like";
const Notification = ({ notification }: NotificationProps) => {
    const notificationTypeMap: Record<
        NotificationType,
        { message: string; icon: JSX.Element; href: string }
    > = {
        follow: {
            message: `${notification.sender.name + notification.content}`,
            icon: <User2 className="size-7 text-primary" />,
            href: `/users/${notification.sender.name}`,
        },
        comment: {
            message: `${notification.sender.name + notification.content}`,
            icon: <MessageCircle className="size-7 fill-primary text-primary" />,
            href: `/posts/${notification.post._id}`,
        },
        like: {
            message: `${notification.sender.name + notification.content}`,
            icon: <Heart className="size-7 fill-red-500 text-red-500" />,
            href: `/posts/${notification.post._id}`,
        },
    };
    const { message, icon, href } = notificationTypeMap[notification.type];
    return (
        <Link href={href} className="block">
            <article
                className={cn(
                    "relative flex justify-between rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
                    !notification.isRead && "bg-primary/10",
                )}
            >
                <div className="my-1">{icon}</div>
                <div className="space-y-3">
                    <UserAvatar avatarUrl={notification.sender.profilePic} size={36} />
                    <div>
                        <span className="font-bold">{notification.sender.username}</span>{" "}
                        <span>{message}</span>
                    </div>
                    {notification.post && (
                        <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
                            {notification.post.text}
                        </div>
                    )}
                </div>
                <img className="w-[100px] h-[100px]" src={notification.post.img} alt="" />
            </article>
        </Link>

    )
}

export default Notification