"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function ContactSellerForm({
  bookId,
  sellerId,
  sellerName,
  currentUserId,
  currentUserEmail,
}: {
  bookId: string;
  sellerId: string;
  sellerName: string;
  currentUserId: string | null;
  currentUserEmail: string | null;
}) {
  const [message, setMessage] = useState(
    "Hi, is this copy still available for campus pickup this week?"
  );
  const [contact, setContact] = useState(currentUserEmail ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!currentUserId) {
    return (
      <div className="ub-panel" style={{ marginTop: "24px" }}>
        <span className="ub-label">Contact seller</span>
        <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>
          Create an account to message {sellerName}
        </h2>
        <p className="muted" style={{ marginBottom: "18px", lineHeight: 1.5 }}>
          Student accounts keep pickup requests connected to verified campus
          members.
        </p>
        <div className="btn-row">
          <Link
            className="btn btn--primary"
            href={`/auth?mode=signup&next=${encodeURIComponent(`/books/${bookId}`)}`}
          >
            Create account
          </Link>
          <Link
            className="btn btn--secondary"
            href={`/auth?mode=login&next=${encodeURIComponent(`/books/${bookId}`)}`}
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (currentUserId === sellerId) {
    return (
      <div className="ub-panel" style={{ marginTop: "24px" }}>
        <p className="muted" style={{ margin: 0 }}>
          This is your listing. Manage its status or view buyer requests in{" "}
          <Link className="link" href="/account">
            My account
          </Link>
          .
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!message.trim()) {
      setError("Write a short note for the seller.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("book_requests").insert({
        book_id: bookId,
        buyer_id: currentUserId,
        seller_id: sellerId,
        message: message.trim(),
        buyer_contact: contact.trim() || currentUserEmail,
      });

      if (insertError) {
        setError(insertError.message);
        setBusy(false);
        return;
      }

      setSent(true);
      setBusy(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send request.");
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="ub-alert ub-alert--success" style={{ marginTop: "24px" }}>
        Pickup request sent to {sellerName}. You can track it under{" "}
        <Link className="link" href="/account">
          My account
        </Link>
        .
      </div>
    );
  }

  return (
    <form className="ub-panel ub-form" style={{ marginTop: "24px" }} onSubmit={handleSubmit}>
      <span className="ub-label">Message seller</span>
      {error && (
        <div className="ub-alert ub-alert--error" role="alert">
          {error}
        </div>
      )}
      <div className="ub-field">
        <label htmlFor="req-msg">Message to {sellerName}</label>
        <textarea
          id="req-msg"
          className="ub-textarea"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="ub-field">
        <label htmlFor="req-contact">Your contact (email or phone)</label>
        <input
          id="req-contact"
          className="ub-input"
          type="text"
          placeholder="Email or campus handle"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <button className="btn btn--primary" type="submit" disabled={busy}>
        {busy ? "Sending..." : "Send pickup request"}
      </button>
    </form>
  );
}
