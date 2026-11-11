import { NextResponse } from "next/server";
import { createServerClientForRequest } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/books";
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/books";
  }

  if (code) {
    const supabase = await createServerClientForRequest();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Ensure email_verified is synced on callback
          const { data: profile } = await supabase
            .from("profiles")
            .select("college")
            .eq("id", userData.user.id)
            .maybeSingle();

          const college = profile?.college?.trim() ?? "";
          if (!college) {
            const onboardingUrl = new URL("/onboarding", origin);
            onboardingUrl.searchParams.set("next", next);
            return NextResponse.redirect(onboardingUrl);
          }
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  const errUrl = new URL("/auth", origin);
  errUrl.searchParams.set("mode", "signup");
  errUrl.searchParams.set("error", "Verification link expired or invalid. Try signing in again.");
  return NextResponse.redirect(errUrl);
}
