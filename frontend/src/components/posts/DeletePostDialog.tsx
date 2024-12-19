"use client"
import { PostData } from "@/lib/types";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import clientRequest from "@/app/api/clientRequest";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";
// import { useDeletePostMutation } from "./mutations";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false)
  const handleDeletePost = async (postId) => {
    try {
      setLoading(true)
      const response = await clientRequest.delete(`/api/posts/${postId}`)
      if (response) {
        toast({
          variant: "success",
          title: "Deleted Post Successfully",
        });
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Post Failed",
      });
      setLoading(false)
      onClose();
    } finally {
      onClose();
      setLoading(false)
    }


  }
  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  return (
    <>
      {loading && (<Loading />)}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <LoadingButton
              onClick={() => { handleDeletePost(post._id) }}
              loading={loading} variant="destructive"

            >
              Delete
            </LoadingButton>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  );
}
