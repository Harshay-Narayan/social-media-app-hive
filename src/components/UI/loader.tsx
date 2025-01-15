import React from "react";
import Spinner from "./spinner";

function Loader() {
  return (
    <div className="bg-black/30 fixed z-[1002] inset-0 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default Loader;
