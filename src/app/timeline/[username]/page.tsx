import TimelinePosts from "@/components/timeline/timeline-posts";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  return (
    <div className="mt-16 flex justify-center">
      <div className="w-full sm:w-[34rem] px-2 sm:px-0">
        <TimelinePosts username={username} />
      </div>
    </div>
  );
}
