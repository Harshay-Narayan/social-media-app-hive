import FriendRequests from "./components/friend-requests";
import FriendsList from "./components/friends-list";
import FriendsSuggestion from "./components/friends-suggestion";

function Friends() {
  return (
    <div className="mt-16">
      <div className="font-extrabold m-2">Friend Requests</div>
      <div>
        <FriendRequests />
      </div>
      <div className="font-extrabold m-2">Friends</div>
      <div>
        <FriendsList />
      </div>
      <div className="font-extrabold m-2">People You May Know</div>
      <div>
        <FriendsSuggestion />
      </div>
    </div>
  );
}

export default Friends;
