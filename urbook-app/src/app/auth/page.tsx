import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth-server";
import { AuthFlow } from "@/components/auth-flow";

async function AuthContent({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const nextPath =
    params.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/books";

  if (profile) {
    if (!profile.college?.trim()) {
      redirect(`/onboarding?next=${encodeURIComponent(nextPath)}`);
    }
    redirect(nextPath);
  }

  const initialMode = params.mode === "login" ? "login" : "signup";

  return (
    <AuthFlow
      initialMode={initialMode}
      nextPath={nextPath}
      initialError={params.error ?? ""}
    />
  );
}

export default function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string; error?: string }>;
}) {
  return (
    <main id="top" className="ub-page ub-page--surface">
      <div className="wrap">
        <Suspense
          fallback={
            <div className="ub-auth-wrap">
              <p className="muted">Loading account sign-in...</p>
            </div>
          }
        >
          <AuthContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
