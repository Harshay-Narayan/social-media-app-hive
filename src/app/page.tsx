import Feed from "@/components/home/feed";
import ProfileSidebar from "@/components/sidebar/profile-sidebar";
import { CreatePostProvider } from "@/context";

export default async function Home() {
  return (
    <div className="mt-16">
      <div className="hidden sm:block fixed w-80 bottom-0 top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar">
        <ProfileSidebar />
      </div>
      <div className="flex justify-center">
        <CreatePostProvider>
          <Feed />
        </CreatePostProvider>
      </div>
    </div>
  );
}
