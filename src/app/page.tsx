import Feed from "@/components/home/feed";
import ProfileSidebar from "@/components/sidebar/profile-sidebar";
import { CreatePostProvider } from "@/context";
import { Toaster } from "react-hot-toast";

export default async function Home() {
  return (
    <div className="mt-16">
      <div>
        <Toaster position="bottom-left" />
      </div>
      <div className="hidden sm:block fixed w-80 bottom-0 top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar">
        <ProfileSidebar />
      </div>
      <div className="flex justify-center mx-2">
        <CreatePostProvider>
          <Feed />
        </CreatePostProvider>
      </div>
    </div>
  );
}
