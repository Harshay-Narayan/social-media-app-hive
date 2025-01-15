import TimelinePosts from "@/components/timeline/timeline-posts";
import React from "react";

export async function Timeline({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  return (
    <div className="mt-16 flex justify-center">
      <div className="w-[36rem]">
        <TimelinePosts username={username} />
      </div>
    </div>
  );
}

export default Timeline;
