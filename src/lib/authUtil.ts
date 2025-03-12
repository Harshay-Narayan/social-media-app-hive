import { currentUser } from "@clerk/nextjs/server";

export async function getAuthInfo() {
  try {
    const auth = await currentUser();
    return auth;
  } catch (error) {
    throw new Error("Error retrieving userId"+error);
  }
}
