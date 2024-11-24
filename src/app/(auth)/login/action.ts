import clientRequest from "@/app/api/clientRequest";
import { useRouter } from "next/router";

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    error?: string;
}

export async function login(username: string, password: string): Promise<void> {
    try {
        // Prepare payload for API request
        const payload = { username, password };

        // Make API request
        const res = await clientRequest.post<LoginResponse>('api/users/signin', payload);

        const data = res.data;
        console.log('Login response data:', data);

        // Handle potential error in response
        if (data.error) {
            console.error('Login error:', data.error);
            return;
        }

        // Store user data in localStorage
        localStorage.setItem('user-threads', JSON.stringify(data));
    } catch (error: unknown) {
        console.error('An error occurred during login:', error);
    }
}
