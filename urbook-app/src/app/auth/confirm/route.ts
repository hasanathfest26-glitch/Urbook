import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClientForRequest } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  let next = searchParams.get("next") ?? "/books";
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/books";
  }

  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (tokenHash && type) {
    const supabase = await createServerClientForRequest();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (!error) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("college")
            .eq("id", userData.user.id)
            .maybeSingle();
          if (!profile?.college?.trim()) {
            redirectTo.pathname = "/onboarding";
            redirectTo.searchParams.set("next", next);
            return NextResponse.redirect(redirectTo);
          }
        }
        redirectTo.pathname = next;
        return NextResponse.redirect(redirectTo);
      }
    }
  }

  redirectTo.pathname = "/auth";
  redirectTo.searchParams.set("mode", "signup");
  redirectTo.searchParams.set(
    "error",
    "Verification link could not be confirmed. Request a new code below."
  );
  return NextResponse.redirect(redirectTo);
}
