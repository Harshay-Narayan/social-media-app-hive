import { SignInButton } from "@clerk/nextjs";
import React from "react";
import Container from "../UI/container";

function SingInPage() {
  return (
    <div className="h-screen grid sm:grid-cols-3 grid-rows-3">
      <div className="sm:col-span-2 row-span-1 sm:ml-20 sm:mt-48 p-3 sm:p-0">
        <div>
          <div
            className="text-8xl font-bold text-blue-600"
            style={{ textShadow: "-1px 1px 2px black" }}
          >
            Hive
          </div>
          <div className="text-gray-600 text-xl">
            Hive helps you connect and share with the people in your life.
          </div>
        </div>
      </div>
      <div className="sm:mt-48 row-span-2">
        <Container className="p-5 w-5/6 h-fit max-sm:mx-auto">
          <SignInButton>
            <button className="bg-blue-600 p-3 font-bold text-lg w-full rounded text-white">
              Sign In
            </button>
          </SignInButton>
        </Container>
      </div>
    </div>
  );
}

export default SingInPage;
