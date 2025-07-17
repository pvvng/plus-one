import { User } from "@supabase/supabase-js";

export function extractUserInfo(user: User) {
  const userMetadata = user.user_metadata;
  const username: string =
    userMetadata.name ??
    userMetadata.full_name ??
    userMetadata.user_name ??
    `사용자_${Date.now()}`;
  const email: string = user.email ?? userMetadata.email ?? "unknown-email";
  const provider = user.app_metadata.provider || "unknown-provider";

  return { username, email, provider };
}
