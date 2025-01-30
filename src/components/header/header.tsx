import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Notification from "./notifications/notification";


function Header() {
  return (
    <header>
      <div className="fixed z-[999] top-0 right-0 left-0 bg-blue-500/80 h-14 backdrop-blur-sm flex items-center ">
        <div className="mx-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div>
          <Link href="/">Home</Link>
        </div>
        <Notification/>
      </div>
    </header>
  );
}

export default Header;
