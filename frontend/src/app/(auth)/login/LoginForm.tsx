"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import clientRequest from "@/app/api/clientRequest";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
    const [error, setError] = useState<string>();
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginValues) {
        setError(undefined); // Clear previous errors
        startTransition(async () => {
            try {
                const payload = { username: values.username, password: values.password };
                const result = await clientRequest.post("/api/users/signin", payload);
                if (result.data) {
                    console.log(result.data)
                    localStorage.setItem('user-threads', JSON.stringify(result.data));
                    toast({
                        title: "Login Success",
                        description: `Login as ${result.data.username} success`,
                        variant: "success"
                    });
                    router.push("/");
                } else {
                    // Handle error (e.g., display a message)
                    console.error('Login failed.');
                }
            } catch (err) {
                // Capture and display error message
                setError('Failed to log in. Please check your username and password.');
                console.error('Login error:', err);
            }
        });
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {error && <p className="text-center text-destructive">{error}</p>}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isPending} type="submit" className="w-full">
                    Log in
                </LoadingButton>
            </form>
        </Form>
    );
}