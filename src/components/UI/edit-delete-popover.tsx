import React from "react";

type EditDeletePopoverProps = {
  onDelete?: () => void;
  onEdit?: () => void;
};

function EditDeletePopover({ onDelete, onEdit }: EditDeletePopoverProps) {
  console.log("edit delete pop over");
  return (
    <div className="p-1 absolute h-fit -left-1/2 -translate-x-6 top-10 text-xs border shadow-lg rounded-md w-24 bg-white">
      <div className="absolute z-10 bg-white -top-[0.4rem] left-1/2 -translate-x-1/2 w-3 h-3 border-t border-l rotate-45 "></div>
      <div
        onClick={onEdit}
        className="hover:bg-zinc-300 p-1 rounded cursor-pointer relative z-20"
      >
        Edit
      </div>
      <div
        onClick={onDelete}
        className="hover:bg-zinc-300 p-1 rounded cursor-pointer"
      >
        Delete
      </div>
    </div>
  );
}

export default EditDeletePopover;
