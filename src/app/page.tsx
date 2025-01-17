import Feed from "@/components/home/feed";
import ProfileSidebar from "@/components/serverComponents/sidebar/profile-sidebar";
import { CreatePostProvider } from "@/context";

export default async function Home() {
  return (
    <div className="mt-16">
      <div className="fixed w-80 bg-slate-200">
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
