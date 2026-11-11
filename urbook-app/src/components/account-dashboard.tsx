"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLLEGES, type Book, type BookRequestItem } from "@/lib/books";
import type { UserProfile } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/client";

export function AccountDashboard({
  profile,
  initialListings,
  incomingRequests,
  outgoingRequests,
}: {
  profile: UserProfile;
  initialListings: Book[];
  incomingRequests: BookRequestItem[];
  outgoingRequests: BookRequestItem[];
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.fullName);
  const [college, setCollege] = useState(profile.college || COLLEGES[0]);
  const [listings, setListings] = useState(initialListings);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: profile.id,
          full_name: fullName.trim() || "Urbook student",
          college,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        setError(updateError.message);
      } else {
        setNotice("Profile saved.");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!profile.email) return;
    setError("");
    setNotice("");
    setVerifying(true);
    try {
      const supabase = createClient();
      const { error: resendErr } = await supabase.auth.resend({
        type: "signup",
        email: profile.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });
      if (resendErr) {
        setError(resendErr.message);
      } else {
        setNotice(`Verification link sent to ${profile.email}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send verification email.");
    } finally {
      setVerifying(false);
    }
  };

  const handleToggleStatus = async (book: Book) => {
    const nextStatus = book.status === "available" ? "sold" : "available";
    const supabase = createClient();
    const { error: updateErr } = await supabase
      .from("books")
      .update({ status: nextStatus })
      .eq("id", book.id)
      .eq("seller_id", profile.id);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }

    setListings((prev) =>
      prev.map((item) => (item.id === book.id ? { ...item, status: nextStatus } : item))
    );
    router.refresh();
  };

  const handleDelete = async (bookId: string) => {
    const supabase = createClient();
    const { error: delErr } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId)
      .eq("seller_id", profile.id);

    if (delErr) {
      setError(delErr.message);
      return;
    }

    setListings((prev) => prev.filter((item) => item.id !== bookId));
    router.refresh();
  };

  return (
    <>
      <div className="ub-head">
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <span
            className="ub-avatar"
            style={{ width: "56px", height: "56px", fontSize: "20px" }}
          >
            {(fullName?.[0] ?? "U").toUpperCase()}
          </span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 className="ub-head__title" style={{ fontSize: "clamp(26px, 2.6vw, 38px)" }}>
                {fullName}
              </h1>
              <span
                className={`ub-chip${profile.emailVerified ? " ub-chip--verified" : ""}`}
              >
                {profile.emailVerified ? "Verified account" : "Verification pending"}
              </span>
            </div>
            <p className="muted" style={{ margin: "6px 0 0", fontSize: "14px" }}>
              {profile.email ?? "OAuth account"} · {college || "Select campus"}
            </p>
          </div>
        </div>

        <div className="btn-row">
          <Link className="btn btn--primary" href="/sell">
            List a book
          </Link>
          <form action="/auth/signout" method="post">
            <button className="btn btn--secondary" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {!profile.emailVerified && profile.email && (
        <div
          className="ub-alert"
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <span>
            Confirm your email address ({profile.email}) so buyers see your verified
            student badge.
          </span>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={verifying}
            onClick={handleResendVerification}
          >
            {verifying ? "Sending..." : "Resend verification"}
          </button>
        </div>
      )}

      {error && (
        <div className="ub-alert ub-alert--error" role="alert" style={{ marginTop: "20px" }}>
          {error}
        </div>
      )}
      {notice && (
        <div className="ub-alert ub-alert--success" role="status" style={{ marginTop: "20px" }}>
          {notice}
        </div>
      )}

      <div className="ub-split" style={{ marginTop: "32px" }}>
        <form className="ub-panel ub-form" onSubmit={handleSaveProfile}>
          <span className="ub-label">Student profile</span>
          <div className="ub-field">
            <label htmlFor="acc-name">Full name</label>
            <input
              id="acc-name"
              className="ub-input"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="ub-field">
            <label htmlFor="acc-college">College</label>
            <select
              id="acc-college"
              className="ub-select"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            >
              {COLLEGES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn--secondary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update profile"}
          </button>
        </form>

        <div className="ub-panel" style={{ display: "grid", gap: "20px" }}>
          <div>
            <span className="ub-label">Incoming buyer requests</span>
            {incomingRequests.length === 0 ? (
              <p className="muted" style={{ margin: 0, fontSize: "14px" }}>
                No buyer inquiries yet. Requests for your listed textbooks appear here.
              </p>
            ) : (
              <ul style={{ display: "grid", gap: "12px", margin: 0, padding: 0, listStyle: "none" }}>
                {incomingRequests.map((req) => (
                  <li
                    key={req.id}
                    style={{
                      padding: "14px",
                      borderRadius: "var(--r-sm)",
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <strong>{req.bookTitle}</strong>
                      <span className="muted" style={{ fontSize: "13px" }}>
                        ₹{req.bookPrice}
                      </span>
                    </div>
                    <p style={{ margin: "6px 0", fontSize: "14px", color: "var(--ink)" }}>
                      {req.message}
                    </p>
                    <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
                      From {req.buyerName}
                      {req.buyerCollege ? ` · ${req.buyerCollege}` : ""}
                      {req.buyerContact ? ` · Contact: ${req.buyerContact}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
            <span className="ub-label">Requests you sent</span>
            {outgoingRequests.length === 0 ? (
              <p className="muted" style={{ margin: 0, fontSize: "14px" }}>
                You haven&apos;t messaged any sellers yet.
              </p>
            ) : (
              <ul style={{ display: "grid", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                {outgoingRequests.map((req) => (
                  <li
                    key={req.id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--r-sm)",
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <Link className="link" href={`/books/${req.bookId}`}>
                        {req.bookTitle}
                      </Link>
                      <span className="muted" style={{ fontSize: "13px" }}>
                        To {req.sellerName}
                      </span>
                    </div>
                    <p className="muted" style={{ margin: "6px 0 0", fontSize: "13px" }}>
                      {req.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <section style={{ marginTop: "48px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "28px" }}>Your listings</h2>
          <span className="muted" style={{ fontSize: "14px" }}>
            {listings.length} total
          </span>
        </div>

        {listings.length === 0 ? (
          <div className="ub-empty">
            <p>You haven&apos;t listed any course books yet.</p>
            <Link className="btn btn--primary" href="/sell">
              List your first book
            </Link>
          </div>
        ) : (
          <div className="ub-book-grid">
            {listings.map((book) => (
              <article key={book.id} className="ub-book">
                <Link className="ub-book__link" href={`/books/${book.id}`}>
                  <div className="ub-book__cover" style={{ background: book.shade }}>
                    {book.coverUrl && <img src={book.coverUrl} alt={book.title} />}
                    <span className="ub-book__badge">
                      {book.status === "sold" ? "Sold" : book.condition}
                    </span>
                    {!book.coverUrl && (
                      <span className="ub-book__cover-title">{book.title}</span>
                    )}
                  </div>
                  <div className="ub-book__body">
                    <h3 className="ub-book__title">{book.title}</h3>
                    <p className="ub-book__author">
                      {book.author} · {book.course}
                    </p>
                    <div className="ub-book__foot">
                      <strong className="ub-book__price">₹{book.price}</strong>
                      <span className="ub-book__college">{book.college}</span>
                    </div>
                  </div>
                </Link>
                <div
                  style={{
                    padding: "0 16px 16px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    style={{ flex: 1 }}
                    onClick={() => handleToggleStatus(book)}
                  >
                    {book.status === "available" ? "Mark as sold" : "Relist"}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
