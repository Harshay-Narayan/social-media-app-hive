import { currentUser } from "@clerk/nextjs/server";
import { validateUserName } from "@/lib/userUtils";
import Image from "next/image";
import { UsersRound } from "lucide-react";
import Link from "next/link";

export default async function ProfileSidebar() {
  const user = await currentUser();
  const fullName = validateUserName(user?.firstName, user?.lastName);

  return (
    <div>
      <div className="flex items-center cursor-pointer gap-2">
        <div className="rounded-full overflow-hidden h-7 w-7">
          <Image
            src={user?.imageUrl || "/avatar.svg"}
            alt="user-profile-image"
            height={30}
            width={30}
          />
        </div>
        <Link href={`/timeline/${user?.username as string}`}>
          <span className="font-semibold">{fullName}</span>
        </Link>
      </div>
      <Link href="/friends">
        <div className="flex items-center cursor-pointer gap-2 mt-2">
          <div className="rounded-full overflow-hidden h-7 w-7">
            <UsersRound />
          </div>
          <span className="font-semibold">Friends</span>
        </div>
      </Link>
    </div>
  );
}
