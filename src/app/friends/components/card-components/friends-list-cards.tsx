import Image from "next/image";
import React from "react";
import Container from "@/components/UI/container";
import { FriendListCardProps } from "@/types";
import Link from "next/link";

function FriendsListCards({
  first_name,
  last_name,
  user_avatar_url,
  username,
  removeFriendHandler,
}: FriendListCardProps) {
  const onRemoveFrined = (username: string) => {
    removeFriendHandler(username);
  };
  return (
    <Container className="w-44 rounded overflow-hidden">
      <div className="h-44 w-full">
        <Image
          src={user_avatar_url}
          alt="profile-image"
          width={300}
          height={300}
        />
      </div>
      <div className="pl-2 pt-2 font-bold">
        <Link href={`/timeline/${username}`}>
          <span className="hover:underline">{`${first_name} ${last_name}`}</span>
        </Link>
      </div>
      <div className="p-2 w-full">
        <button
          className="bg-[#0866FF] rounded p-1 w-full font-bold text-white"
          onClick={() => onRemoveFrined(username)}
        >
          Remove Friend
        </button>
      </div>
    </Container>
  );
}

export default FriendsListCards;
