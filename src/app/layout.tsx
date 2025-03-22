import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Header from "@/components/header/header";
import QueryProvider from "@/lib/providers";
import ChatSidebar from "@/components/sidebar/chat-sidebar";
import ChatHead from "@/components/chat/chat-head";
import ChatPopup from "@/components/chat/chat-popup";

export const metadata: Metadata = {
  title: "Hive",
  description: "Social media Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body className={` antialiased bg-[#F2F4F7]`}>
            <SignedOut>
              <SignInButton>
                <div className="flex justify-center mt-10">
                  <button className="bg-blue-600 p-2 rounded text-white w-32">
                    Sign in
                  </button>
                </div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Header />
              <ChatSidebar />
              <ChatHead />
              <ChatPopup />
              {children}
            </SignedIn>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
