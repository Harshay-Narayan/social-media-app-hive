import Image from "next/image";
import React from "react";

function ProfileIcon({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="rounded-full overflow-hidden w-10 h-10">
      <Image
        src={imageUrl || "/avatar.svg"}
        alt="profile-image"
        width={50}
        height={50}
      />
    </div>
  );
}

export default ProfileIcon;
