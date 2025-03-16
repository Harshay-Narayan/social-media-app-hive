import { getAuthInfo } from "@/lib/authUtil";
import { getImageUrl, getPostsofUser, getUserId } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";
const BUCKET_NAME = "post-images";

export async function GET(request: NextRequest) {
  try {
    const searcParam = request.nextUrl.searchParams;
    const username = searcParam.get("username");
    console.log(username);
    if (!username) {
      return NextResponse.json(
        { message: "Username required" },
        { status: 401 }
      );
    }

    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const userId = await getUserId(username);
    if (!userId) {
      return NextResponse.json({ message: "userId Required" }, { status: 401 });
    }
    const myPosts = await getPostsofUser(userId, authInfo.id);
    const myPostsWithImageUrl = myPosts.map((post) => {
      const { likes, ...rest } = post;
      return {
        ...rest,
        post_image_url: post.post_image_location
          ? getImageUrl(BUCKET_NAME, post.post_image_location)
          : null,
        isLiked: !!likes.length,
      };
    });
    return NextResponse.json(
      { posts: myPostsWithImageUrl, success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
