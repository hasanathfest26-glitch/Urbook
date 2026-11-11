import "server-only";
import { createServerClientForRequest } from "@/lib/supabase/server";

export type UserProfile = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string;
  college: string;
  avatarUrl: string | null;
};

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createServerClientForRequest();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return null;

  const user = userData.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, college, avatar_url, email_verified")
    .eq("id", user.id)
    .maybeSingle();

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fallbackName =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    (user.email ? user.email.split("@")[0] : "Urbook student");

  const fallbackCollege =
    typeof meta.college === "string" ? meta.college.trim() : "";

  return {
    id: user.id,
    email: user.email ?? null,
    emailVerified: Boolean(user.email_confirmed_at || profile?.email_verified),
    fullName: profile?.full_name || fallbackName,
    college: profile?.college ?? fallbackCollege,
    avatarUrl: profile?.avatar_url ?? null,
  };
}
