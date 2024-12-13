import React, { MouseEvent, KeyboardEvent, useEffect } from "react";
import { X } from "lucide-react";

type CloseButtonProps = {
  className?: string;
  crossSize?: number;
  crossColor?: string;
  crossStrokeWidth?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onClose?: () => void;
};
function CloseButton({
  className,
  crossSize,
  crossColor,
  crossStrokeWidth,
  onClick,
  onClose,
}: CloseButtonProps) {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    (document as any).addEventListener("keydown", handleEscapeKey);
    return () =>
      (document as any).removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);
  return (
    <button
      className={`bg-gray-300 rounded-full w-fit h-fit p-[3px] cursor-pointer ${className}`}
      onClick={onClick}
      aria-label="close"
    >
      <X color={crossColor} size={crossSize} strokeWidth={crossStrokeWidth} />
    </button>
  );
}

export default CloseButton;
