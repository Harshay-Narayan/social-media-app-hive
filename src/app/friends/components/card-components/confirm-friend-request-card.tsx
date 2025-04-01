import Image from "next/image";
import Container from "@/components/UI/container";
import Link from "next/link";
import { ConfirmFriendRequestCardProps } from "@/types";
import { cn } from "@/lib/utils";

function ConfirmFriendRequestCard({
  first_name,
  last_name,
  user_avatar_url,
  username,
  isRequestAccepted,
  isRequestRejected,
  acceptFriendRequestHandler,
  rejectFriendRequestHandler,
}: ConfirmFriendRequestCardProps) {
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

      <div
        className={`p-2 w-full ${
          isRequestAccepted ? "bg-zinc-400 cursor-not-allowed" : ""
        } ${isRequestRejected ? "invisible" : ""}`}
      >
        <button
          className="bg-[#0866FF] rounded p-1 w-full font-semibold text-white"
          onClick={() => acceptFriendRequestHandler(username)}
        >
          {isRequestAccepted ? "Friends" : "Confirm"}
        </button>
      </div>

      <div className="p-2 pt-0 w-full">
        <button
          className={cn(
            "bg-zinc-300 rounded p-1 w-full font-semibold",
            isRequestRejected && "bg-zinc-400 cursor-not-allowed",
            isRequestAccepted && "invisible"
          )}
          onClick={() => rejectFriendRequestHandler(username)}
        >
          {isRequestRejected ? "Request Deleted" : "Delete"}
        </button>
      </div>
    </Container>
  );
}

export default ConfirmFriendRequestCard;
