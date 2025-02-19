import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Header from "@/components/header/header";
// import { Roboto } from "next/font/google";
import QueryProvider from "@/lib/providers";
import StatusUpdater from "@/components/status-update-component/status-update";

// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: "300",
// });

export const metadata: Metadata = {
  title: "Chitter",
  description: "Next generation social media",
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
          {/* ${roboto.className} */}
          <body className={` antialiased bg-[#F2F4F7]`}>
            <StatusUpdater />
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
              {children}
            </SignedIn>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
