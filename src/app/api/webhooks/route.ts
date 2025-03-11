import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUserProfileImage } from "@/lib/dbUtils";
import { createOrUpdateUserStatusOnline } from "@/lib/dbUtils/userSessionStatusdbUtils";
import {
  setStatusOnline,
  setStatusoffline,
} from "@/lib/active-user-status/setUserStatus";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const webhook = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  //   const { id } = evt.data;
  //   const eventType = evt.type;
  //   console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  //   console.log("Webhook payload:", body);

  // user event logic
  if (evt.type === "user.created") {
    try {
      const user = createUser(
        evt.data.username as string,
        evt.data.id,
        evt.data.email_addresses[0].email_address,
        evt.data.first_name as string,
        evt.data.last_name as string,
        evt.data.image_url
      );
      return new Response("User Created", { status: 201 });
    } catch (error: any) {
      return new Response("Error creating user in DB " + error, {
        status: 500,
      });
    }
  }

  if (evt.type === "user.deleted") {
    try {
      const user_id = evt.data.id;
      if (user_id) {
        const deletedUser = await deleteUser(user_id);
        return new Response("User Deleted from DB: " + deletedUser, {
          status: 200,
        });
      }
    } catch (error) {
      return new Response("Error in deleteing user in DB" + error, {
        status: 500,
      });
    }
  }

  if (evt.type === "user.updated") {
    try {
      const updateUser = await updateUserProfileImage(
        evt.data.id,
        evt.data.image_url
      );
      return new Response("User avatar updated ", { status: 200 });
    } catch (error) {
      return new Response("Error in updating user avatar" + error, {
        status: 500,
      });
    }
  }

  if (evt.type === "session.created") {
    try {
      await createOrUpdateUserStatusOnline(evt.data.user_id);
      await setStatusOnline(evt.data.user_id);
      return new Response("online status updated", { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response("Error in setting status online" + error, {
        status: 500,
      });
    }
  }

  if (
    evt.type === "session.removed" ||
    evt.type === "session.ended" ||
    evt.type === "session.revoked"
  ) {
    try {
      await setStatusoffline(evt.data.user_id);
      return new Response("offline status updated", { status: 200 });
    } catch (error) {
      return new Response("Error in setting status offline" + error, {
        status: 500,
      });
    }
  }
}
