import { getCurrentProfile } from "@/lib/auth-server";
import { HeaderNavClient } from "@/components/header-nav-client";

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  return <HeaderNavClient profile={profile} />;
}
