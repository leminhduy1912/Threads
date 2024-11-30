import { useState } from "react";

export const useFileUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadFile = async (file: File, endpoint: string): Promise<any> => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            setUploadError(error.message);
            console.error("File upload error:", error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading, uploadError };
};
