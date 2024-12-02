import clientRequest from "@/app/api/clientRequest";
import { useRouter } from "next/router";

export interface SignUpResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    error?: string;
}

export async function signup(username: string, password: string, name: string, email: string): Promise<void> {
    try {
        // Prepare payload for API request
        const payload = { username, password, name, email };

        // Make API request
        const res = await clientRequest.post('api/users/signup', payload);

        const data = res.data;
        console.log('Sign up response data:', data);

        // Handle potential error in response
        if (data.error) {
            console.error('Sign up error:', data.error);
            return;
        }

        // Store user data in localStorage
        localStorage.setItem('user-threads', JSON.stringify(data));
    } catch (error: unknown) {
        console.error('An error occurred during login:', error);
    }
}
