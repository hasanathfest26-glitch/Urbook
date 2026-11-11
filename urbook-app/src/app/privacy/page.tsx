export default function PrivacyPage() {
  return (
    <main id="top" className="ub-page">
      <div className="wrap" style={{ maxWidth: "740px" }}>
        <span className="ub-label">Legal</span>
        <h1 className="ub-head__title" style={{ marginBottom: "24px" }}>
          Privacy notice
        </h1>
        <div className="stack-5" style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          <p>
            Urbook stores your account name, college selection, email address (or
            Google/Apple sign-in identifier), and the course book listings and
            pickup requests you submit.
          </p>
          <p>
            Public visitors can read available book titles, prices, conditions,
            seller names, and campus names. Pickup request messages and buyer
            contact notes are visible only to the buyer and seller involved.
          </p>
          <p>
            You can edit your profile, mark books as sold, or delete your
            listings at any time from your account page.
          </p>
        </div>
      </div>
    </main>
  );
}
