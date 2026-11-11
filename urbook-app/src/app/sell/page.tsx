import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth-server";
import { SellBookForm } from "@/components/sell-book-form";

async function SellContent() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/auth?mode=signup&next=/sell");
  }
  if (!profile.college?.trim()) {
    redirect("/onboarding?next=/sell");
  }

  return (
    <div className="ub-split">
      <div>
        <span className="ub-label">Sell a textbook</span>
        <h1 className="ub-head__title">List a course book</h1>
        <p className="ub-head__sub">
          Add the title, course, condition, and asking price in rupees. Verified
          students on your campus will message you directly.
        </p>
      </div>

      <SellBookForm userId={profile.id} defaultCollege={profile.college} />
    </div>
  );
}

export default function SellPage() {
  return (
    <main id="top" className="ub-page">
      <div className="wrap">
        <Suspense fallback={<p className="muted">Checking your student account...</p>}>
          <SellContent />
        </Suspense>
      </div>
    </main>
  );
}
