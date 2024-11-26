// import { useState } from "react";
// //import { useShowToast } from "./useShowToast"; // Adjust the import path as needed

// interface UsePreviewImgReturn {
//     handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     imgUrl: string | null;
//     setImgUrl: React.Dispatch<React.SetStateAction<string | null>>;
//     removeImage: () => void;
// }

// export const usePreviewImg = (): UsePreviewImgReturn => {
//     const [imgUrl, setImgUrl] = useState<string | null>(null);
//     //const showToast = useShowToast();

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file && file.type.startsWith("image/")) {
//             const reader = new FileReader();

//             reader.onloadend = () => {
//                 setImgUrl(reader.result as string);
//             };

//             reader.readAsDataURL(file);
//         } else {
//             //showToast("Invalid file type", "Please select an image file", "error");
//         }
//     };

//     const removeImage = () => {
//         if (imgUrl) {
//             setImgUrl(null); // Reset imgUrl to null
//         } else {
//             //showToast("No Image", "There is no image to remove", "warning");
//         }
//     };

//     return { handleImageChange, imgUrl, setImgUrl, removeImage };
// };
import { useState } from "react";

// export function usePreviewImg() {
//     const [imgUrl, setImgUrl] = useState<string | null>(null);

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const objectUrl = URL.createObjectURL(file);
//             setImgUrl(objectUrl);

//             // Reset giá trị của input để có thể chọn lại cùng ảnh
//             e.target.value = ""; // Clear giá trị sau khi xử lý
//         }
//     };

//     const removeImage = () => {
//         setImgUrl(null);
//     };

//     return {
//         handleImageChange,
//         imgUrl,
//         setImgUrl,
//         removeImage,
//     };
// }
export const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
    // const showToast = useShowToast();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImgUrl(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
            //showToast("Invalid file type", " Please select an image file", "error");
            //setImgUrl(null);
        }
    };

    const removeImage = () => {
        if (imgUrl) {
            setImgUrl(null); // Xóa URL hiện tại bằng cách đặt lại thành null
            //showToast("Image Removed");
        } else {
            //showToast("No Image", "There is no image to remove", "warning");
        }
    };
    return { handleImageChange, imgUrl, setImgUrl, removeImage };
};
export default usePreviewImg;
