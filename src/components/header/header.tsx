import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";

function Header() {
  return (
    <header>
      <div className="fixed top-0 right-0 left-0 bg-blue-500/80 h-14 backdrop-blur-sm flex items-center flex-row-reverse">
        <div className="mx-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div className="">
          <button>Home</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
