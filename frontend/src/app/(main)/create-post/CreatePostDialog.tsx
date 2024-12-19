"use client";

import clientRequest from "@/app/api/clientRequest";
import Loading from "@/app/loading";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CreatePostValues, createPostSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";
import axios from "axios";

interface CreatePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState();

    // Access localStorage only on the client side
    useEffect(() => {
        const userData = localStorage.getItem("user-threads");
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
    }, []);

    // Form initialization
    const form = useForm<CreatePostValues>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            text: "",
            img: "",
        },
    });
    const handleRemoveImage = () => {
        setPreviewImage(null);
        form.setValue("img", ""); // Clear the image field in the form
    };
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Convert file to Base64
    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            form.setValue("img", base64String); // Update the "image" field in the form
            setPreviewImage(base64String); // Update preview image
        };
        reader.onerror = () => {
            toast({
                title: "Error",
                description: "Failed to load image. Please try again.",
                variant: "destructive",
            });
        };
        reader.readAsDataURL(file);
    };

    // Handle form submission
    const handleSubmitForm = async () => {
        try {
            setIsLoading(true);
            if (currentUser) {
                form.setValue("postedBy", currentUser._id); // Add the user ID to the form data
            }
            const values = form.getValues();
            if (!values.text && !values.img) {
                toast({
                    variant: "destructive",
                    title: "Missing Input",
                    description: "Please provide a text or select an image to proceed.",
                });
                setIsLoading(false);
                return;
            }
            if (values.img) {
                const isToxicImage = await axios.post("http://localhost:8080/detect", {
                    image: values.img,
                });

                if (isToxicImage.data.detections.length > 0) {
                    toast({
                        variant: "destructive",
                        title: "Unacceptable Image",
                        description: "The selected image contains harmful content. Please choose another image.",
                    });
                    setIsLoading(false);
                    form.setValue("img", "");
                    setPreviewImage("")
                    return; // Prevent further execution
                }
            }
            if (values.text) {
                const isToxicText = await axios.post("http://localhost:5000/predict", {
                    text: values.text,
                });

                if (isToxicText.data.prediction === "Toxic") {
                    toast({
                        variant: "destructive",
                        title: "Unacceptable Comment",
                        description: "Your text contains harmful content. Please revise your text.",
                    });
                    setIsLoading(false);
                    form.setValue("img", "");
                    form.setValue("text", "");
                    setPreviewImage("")
                    return; // Prevent further execution
                }
            }
            const response = await clientRequest.post("api/posts/create", values);
            if (response.data) {
                // Show success message
                toast({
                    title: "Success",
                    description: "Your post has been created successfully.",
                    variant: "success",
                });
            }

            // Close the modal
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating post:", error);

            // Show error message
            toast({
                title: "Error",
                description: "There was an issue creating your post. Please try again.",
                variant: "destructive",
            });
            setPreviewImage("")
            form.setValue("text", "");
        } finally {
            setIsLoading(false);
            setPreviewImage("")
            form.setValue("text", "");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {isLoading && <Loading />}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <div className="space-y-3">
                        {/* Content Field */}
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter your status" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Field */}
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                }}
                            />
                            <FormMessage />
                        </FormItem>

                        {/* Preview Image */}
                        {previewImage && (
                            <div>
                                <p>Preview Image:</p>
                                <Image
                                    src={previewImage || avatarPlaceholder}
                                    alt="Preview"
                                    width={150}
                                    height={150}
                                    className="object-cover"
                                /> <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}

                        <DialogFooter>
                            <LoadingButton onClick={handleSubmitForm} loading={isLoading}>
                                Submit
                            </LoadingButton>
                        </DialogFooter>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
