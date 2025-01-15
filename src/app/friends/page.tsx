import FriendRequests from "./components/friend-requests";
import FriendsList from "./components/friends-list";
import FriendsSuggestion from "./components/friends-suggestion";

function Friends() {
  return (
    <div className="mt-16">
      <div className="font-extrabold">Friend Requests</div>
      <div>
        <FriendRequests />
      </div>
      <div className="font-extrabold">People You May Know</div>
      <div>
        <FriendsSuggestion />
      </div>
      <div className="font-extrabold">Friends</div>
      <div>
        <FriendsList />
      </div>
    </div>
  );
}

export default Friends;
