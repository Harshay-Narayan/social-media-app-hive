import FriendRequests from "./components/friend-requests";
import FriendsList from "./components/friends-list";
import FriendsSuggestion from "./components/friends-suggestion";

function Friends() {
  return (
    <div className="mt-16 mx-2">
      <div className="font-extrabold">Friend Requests</div>
      <div className="my-2">
        <FriendRequests />
      </div>
      <div className="font-extrabold">Friends</div>
      <div className="my-2">
        <FriendsList />
      </div>
      <div className="font-extrabold">People You May Know</div>
      <div className="my-2">
        <FriendsSuggestion />
      </div>
    </div>
  );
}

export default Friends;
