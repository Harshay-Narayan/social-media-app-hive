"use client";
import React, { useState } from "react";
import Spinner from "@/components/UI/spinner";

function useLoader() {
  const toggleLoader = () => {
    setShowLoader(!showLoader);
  };
  const [showLoader, setShowLoader] = useState<boolean>(false);
  return (
    <>
      {showLoader ? (
        <div className="bg-black/30 fixed z-[1002] inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      ) : null}
    </>
  );
}

export default useLoader;
