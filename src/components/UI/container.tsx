import React, { forwardRef } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm shadow-gray-300 ${className}`}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Container;
