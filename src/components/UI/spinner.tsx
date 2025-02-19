import React from "react";

interface ISpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
function Spinner({ className, ...props }: ISpinnerProps) {
  return (
    <div
      className={`w-16 h-16 rounded-full border-8 border-gray-300 border-t-blue-600 animate-spin ${className}`}
      {...props}
    ></div>
  );
}

export default Spinner;
