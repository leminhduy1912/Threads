
import clientRequest from "@/app/api/clientRequest";
import Loading from "@/app/loading";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "@/components/CropImageDialog";
import LoadingButton from "@/components/LoadingButton";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/lib/types";
import {
    updateUserProfileSchema,
    UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import { useRouter } from "next/compat/router";

interface EditProfileDialogProps {
    user: UserData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProfileUpdate: () => void;
}

export default function EditProfileDialog({
    user,
    open,
    onOpenChange,
    onProfileUpdate
}: EditProfileDialogProps) {
    const { toast } = useToast();

    const form = useForm<UpdateUserProfileValues>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            username: user.username,
            bio: user.bio || "",
            profilePic: user.profilePic || "" // Thêm profilePic vào defaultValues
        },
    });
    const [isLoading, setIsLoading] = useState(false)
    const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
    function convertBlobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Xử lý sự kiện khi nhấn nút
    const onClickHandler = async () => {
        try {
            // Retrieve form values
            const values = form.getValues();

            // Log the retrieved values for debugging
            console.log("Form Values:", values);
            setIsLoading(true)
            // Make an API request to update the user
            const response = await clientRequest.put(`/api/users/update/${user._id}`, values);
            if (response) {
                toast({
                    title: "Success",
                    description: "Your profile has been updated successfully.",
                    variant: "success"
                });

                setIsLoading(false);

                // Close the modal
                onOpenChange(false);
                onProfileUpdate();
            }
            // Handle successful response (optional)
            console.log("Update successful:", response.data);
            // Add further actions (e.g., notify user or refresh data)
        } catch (error) {
            // Handle errors gracefully
            console.error("Error updating user:", error);
            setIsLoading(false)
            // Optionally, notify the user about the error
            if (error.response) {
                console.log("Error details:", error.response.data);
            }
        }
    };

    // Cập nhật profilePic khi người dùng cắt ảnh hoặc chọn ảnh mới
    function handleImageCropped(blob: Blob | null) {
        setCroppedAvatar(blob);
        if (blob) {
            convertBlobToBase64(blob).then((base64) => {
                form.setValue("profilePic", base64); // Cập nhật profilePic với giá trị Base64
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {isLoading && (
                <Loading />
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-1.5">
                    <Label>Avatar</Label>
                    <AvatarInput
                        src={
                            croppedAvatar
                                ? URL.createObjectURL(croppedAvatar)
                                : user.profilePic || avatarPlaceholder
                        }
                        onImageCropped={handleImageCropped}
                    />
                </div>
                <Form {...form}>
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Hiển thị thông tin profilePic */}
                        <div>
                            <p>Current Avatar: </p>
                            <Image
                                src={form.watch("profilePic") || avatarPlaceholder}
                                alt="Avatar preview"
                                width={150}
                                height={150}
                                className="rounded-full object-cover"
                            />
                        </div>
                        <DialogFooter>
                            <LoadingButton onClick={onClickHandler} loading={isLoading}>
                                Save
                            </LoadingButton>
                        </DialogFooter>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface AvatarInputProps {
    src: string | StaticImageData;
    onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
    const [imageToCrop, setImageToCrop] = useState<File>();

    const fileInputRef = useRef<HTMLInputElement>(null);

    function onImageSelected(image: File | undefined) {
        if (!image) return;

        Resizer.imageFileResizer(
            image,
            1024,
            1024,
            "WEBP",
            100,
            0,
            (uri) => setImageToCrop(uri as File),
            "file",
        );
    }

    return (
        <>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageSelected(e.target.files?.[0])}
                ref={fileInputRef}
                className="sr-only hidden"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative block"
            >
                <Image
                    src={src}
                    alt="Avatar preview"
                    width={150}
                    height={150}
                    className="size-32 flex-none rounded-full object-cover"
                />
                <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
                    <Camera size={24} />
                </span>
            </button>
            {imageToCrop && (
                <CropImageDialog
                    src={URL.createObjectURL(imageToCrop)}
                    cropAspectRatio={1}
                    onCropped={onImageCropped}
                    onClose={() => {
                        setImageToCrop(undefined);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                    }}
                />
            )}
        </>
    );
}
