import ChatHead from "@/components/chat/chat-head";
import Feed from "@/components/home/feed";
import ProfileSidebar from "@/components/sidebar/profile-sidebar";
import PostsSkeletonLoader from "@/components/UI/posts-skeleton-loader";
import { CreatePostProvider } from "@/context";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

export default async function Home() {
  return (
    <div className="mt-16">
      <div>
        <Toaster />
      </div>
      <div className="hidden sm:block fixed w-80 bottom-0 top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar">
        <ProfileSidebar />
      </div>

      <div className="flex justify-center">
        <CreatePostProvider>
          <Suspense fallback={<PostsSkeletonLoader />}>
            <Feed />
          </Suspense>
        </CreatePostProvider>
      </div>
      <div>
        <ChatHead />
      </div>
    </div>
  );
}
