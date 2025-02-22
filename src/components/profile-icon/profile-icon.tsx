import Image from "next/image";
import React from "react";

function ProfileIcon({
  imageUrl,
  className,
}: {
  imageUrl: string;
  className?: string;
}) {
  return (
    <div className={`rounded-full overflow-hidden w-10 h-10 ${className}`}>
      <Image
        src={imageUrl || "/avatar.svg"}
        alt="profile-image"
        width={200}
        height={200}
      />
    </div>
  );
}

export default ProfileIcon;
