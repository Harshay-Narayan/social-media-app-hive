import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "@/components/signin/signin";
import Header from "@/components/header/header";
import QueryProvider from "@/lib/providers";
import ChatComponentsWrapper from "@/components/UI/chat-components-wrapper";

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
              <SignInPage />
            </SignedOut>
            <SignedIn>
              <Header />
              <ChatComponentsWrapper />
              {children}
            </SignedIn>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
