import Image from "next/image";
import Container from "@/components/UI/container";
import Link from "next/link";
import { SendFriendRequestCardProps } from "@/types";

function SendFriendRequestCard({
  first_name,
  last_name,
  user_avatar_url,
  username,
  isRequestSent,
  sendFriendRequestHandler,
}: SendFriendRequestCardProps) {
  const onAddFriendClick = (targetUsername: string) => {
    sendFriendRequestHandler(targetUsername);
  };

  return (
    <Container className="w-44 rounded overflow-hidden">
      <div className="h-44 w-full overflow-hidden">
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
          className={`bg-[#0866FF] rounded disabled:cursor-not-allowed p-1 w-full font-bold text-white ${
            isRequestSent && "bg-zinc-400"
          }`}
          onClick={() => onAddFriendClick(username)}
          disabled={isRequestSent}
        >
          {isRequestSent ? "Request Sent" : "Add Friend"}
        </button>
      </div>
    </Container>
  );
}

export default SendFriendRequestCard;
