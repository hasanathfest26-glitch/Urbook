export default function TermsPage() {
  return (
    <main id="top" className="ub-page">
      <div className="wrap" style={{ maxWidth: "740px" }}>
        <span className="ub-label">Legal</span>
        <h1 className="ub-head__title" style={{ marginBottom: "24px" }}>
          Terms of use
        </h1>
        <div className="stack-5" style={{ color: "var(--muted)", lineHeight: 1.65 }}>
          <p>
            Urbook is a campus listing board for used course books. Students
            arrange book inspection, payment, and handoff directly in person on
            campus.
          </p>
          <p>
            Sellers are responsible for describing editions and book condition
            accurately and marking copies sold once handed over.
          </p>
          <p>
            Accounts used for spam, misleading listings, or non-book commercial
            sales may be removed.
          </p>
        </div>
      </div>
    </main>
  );
}
