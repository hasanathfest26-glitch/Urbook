import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth-server";
import { getUserMarketplaceData } from "@/lib/books-service";
import { AccountDashboard } from "@/components/account-dashboard";

async function AccountContent() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/auth?mode=login&next=/account");
  }

  const data = await getUserMarketplaceData(profile.id);

  return (
    <AccountDashboard
      profile={profile}
      initialListings={data.listings}
      incomingRequests={data.incomingRequests}
      outgoingRequests={data.outgoingRequests}
    />
  );
}

export default function AccountPage() {
  return (
    <main id="top" className="ub-page">
      <div className="wrap">
        <Suspense fallback={<p className="muted">Loading your account...</p>}>
          <AccountContent />
        </Suspense>
      </div>
    </main>
  );
}
