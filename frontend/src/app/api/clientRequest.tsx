import axios, { AxiosInstance } from "axios";

// Create an Axios instance with type annotations
export const clientRequest: AxiosInstance = axios.create({
    baseURL: "http://localhost:4000/" as string, // Ensure the environment variable is treated as a string
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include credentials in cross-origin requests
});
export const toxicCommentRequest: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/" as string, // Ensure the environment variable is treated as a string
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include credentials in cross-origin requests
});
export const toxicImageRequest: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/" as string, // Ensure the environment variable is treated as a string
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include credentials in cross-origin requests
});
export default clientRequest;
