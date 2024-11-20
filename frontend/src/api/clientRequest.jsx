import axios from "axios";

export const clientRequest = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});