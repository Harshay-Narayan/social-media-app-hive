import Feed from "@/components/home/feed";
import ChatSidebar from "@/components/serverComponents/sidebar/chat-sidebar";
import ProfileSidebar from "@/components/serverComponents/sidebar/profile-sidebar";
import { CreatePostProvider } from "@/context";
import { Toaster } from "react-hot-toast";

export default async function Home() {
  return (
    <div className="mt-16">
      <div>
        <Toaster />
      </div>
      <div className="fixed w-80 bottom-0 top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar">
        <ProfileSidebar />
      </div>
      <div className="flex justify-center">
        <CreatePostProvider>
          <Feed />
        </CreatePostProvider>
      </div>
      <div>
        <div className="fixed w-80 right-0 top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar">
          <ChatSidebar />
        </div>
      </div>
    </div>
  );
}
