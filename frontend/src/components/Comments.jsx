import {
    Button,
    CloseButton,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,

} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { clientRequest } from "../api/clientRequest";
const MAX_CHAR = 500;
const Comments = (props) => {
    const { reply, postId } = props;

    const [conversation, setConveration] = useState(reply.conversation || []);
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const showToast = useShowToast();
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleImageChange, imgUrl, setImgUrl, removeImage } = usePreviewImg();
    console.log("image", imgUrl)
    console.log("con", conversation)
    const handleReplyComment = () => {
        onOpen()
    }
    const finalRef = useRef(null)
    const user = useRecoilValue(userAtom);

    const handleReply = async (img, textComment) => {
        if (!user) {
            return showToast("Error", "You must be logged in to reply to a post", "error");
        }

        if (!textComment.trim()) {
            return showToast("Error", "Reply cannot be empty", "error");
        }

        try {
            const payload = { text: textComment };
            if (img) {
                payload.img = img;
            }

            const res = await clientRequest.put(`/api/posts/reply/${postId}`, payload);

            if (!res.data) {
                return showToast("Error", "An error occurred while posting the reply", "error");
            }

            if (res.data.error) {
                return showToast("Error", res.data.error, "error");
            }

            showToast("Success", "Reply posted successfully", "success");
            onClose();
        } catch (error) {
            showToast("Error", error.message || "An error occurred", "error");
        }
    };

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setReplyText(truncatedText);
            setRemainingChar(0);
        } else {
            setReplyText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };
    return (
        <>
            <section className="bg-gray-900 py-7 antialiased mt-3 rounded-xl ">


                <div className="max-w-2xl mx-auto px-4 ">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <footer className="flex justify-between items-center mb-2 ">
                            <div className="flex items-center">
                                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                    className="mr-2 w-6 h-6 rounded-full"
                                    src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                    alt="Michael Gough" />{reply.username}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <time dateTime="2022-02-08"
                                        title="February 8th, 2022">{formatDistanceToNow(reply.createdAt)}</time>
                                </p>
                            </div>
                        </footer>
                        {reply?.content?.text && (
                            <p className="text-start text-gray-500 dark:text-gray-400">
                                {reply.content.text}
                            </p>
                        )}
                        {reply?.content?.image && (
                            <img className="max-h-[300px]" src={reply?.content?.image} alt="" />
                        )}
                        <div className="flex items-center mt-4 space-x-4">
                            <button onClick={handleReplyComment}
                                className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                </svg>
                                Reply
                            </button>
                        </div>
                    </div>
                    {/* </article> */}

                    {Array.isArray(conversation) && conversation.map((item, index) => (
                        <article key={index} className="mt-3 p-6 mb-3 ml-6 lg:ml-12 text-base bg-slate-800 rounded-lg ">
                            <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                        className="mr-2 w-6 h-6 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="Jese Leos" />{item.username}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDistanceToNow(item.createdAt)}
                                    </p>
                                </div>
                            </footer>
                            {item.text && (
                                <p className="text-start text-gray-500 dark:text-gray-400">{item.text}</p>
                            )}
                            <img src="https://th.bing.com/th/id/OIP.Xt7qozEdnJg2QHtAKbA-VwHaFj?w=238&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="" />
                            <div className="flex items-center mt-4 space-x-4">
                                <button type="button"
                                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                    </svg>
                                    Reply
                                </button>
                            </div>
                        </article>
                    ))}

                </div>



            </section>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Textarea
                                placeholder='Reply content goes here..'
                                onChange={handleTextChange}
                                value={replyText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {
                            imgUrl && (
                                <div style={{ position: "relative" }}>
                                    <img src={imgUrl} alt="image" style={{ marginTop: "10px", width: "100%", height: "auto", objectFit: "cover" }} />
                                    <CloseButton
                                        onClick={() => removeImage()}
                                        bg={"gray.800"}
                                        position={"absolute"}
                                        top={2}
                                        right={2}
                                    />
                                </div>
                            )
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}
export default Comments