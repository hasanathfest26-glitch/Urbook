import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth-server";
import { OnboardingForm } from "@/components/onboarding-form";

async function OnboardingContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/auth?mode=signup&next=/onboarding");
  }

  const nextPath =
    params.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/books";

  return (
    <OnboardingForm
      userId={profile.id}
      initialName={profile.fullName}
      initialCollege={profile.college}
      nextPath={nextPath}
    />
  );
}

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <main id="top" className="ub-page ub-page--surface">
      <div className="wrap">
        <Suspense
          fallback={
            <div className="ub-auth-wrap">
              <p className="muted">Loading campus setup...</p>
            </div>
          }
        >
          <OnboardingContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
