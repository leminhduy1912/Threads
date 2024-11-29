"use client";

import { RecoilRoot } from "recoil";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./ReactQueryProvider";


export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <RecoilRoot>
            <ReactQueryProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </ReactQueryProvider>
            <Toaster />
        </RecoilRoot>
    );
}
