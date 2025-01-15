import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm shadow-gray-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
