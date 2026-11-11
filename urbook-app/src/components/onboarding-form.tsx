"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { COLLEGES } from "@/lib/books";
import { createClient } from "@/lib/supabase/client";

export function OnboardingForm({
  userId,
  initialName,
  initialCollege,
  nextPath = "/books",
}: {
  userId: string;
  initialName: string;
  initialCollege: string;
  nextPath?: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [college, setCollege] = useState(initialCollege);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/books";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !college) {
      setError("Enter your name and choose your college.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: fullName.trim(),
          college,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        setError(upsertError.message);
        setBusy(false);
        return;
      }

      router.push(safeNext);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
      setBusy(false);
    }
  };

  return (
    <div className="ub-auth-wrap">
      <span className="ub-label">Finish setup</span>
      <h1 style={{ fontSize: "clamp(28px, 3vw, 36px)", marginBottom: "10px" }}>
        Choose your campus
      </h1>
      <p className="muted" style={{ marginBottom: "24px", lineHeight: 1.5 }}>
        Students filter textbooks by college. Confirm your name and campus to
        continue.
      </p>

      {error && (
        <div className="ub-alert ub-alert--error" role="alert" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <form className="ub-form" onSubmit={handleSubmit}>
        <div className="ub-field">
          <label htmlFor="ob-name">Full name</label>
          <input
            id="ob-name"
            className="ub-input"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="ub-field">
          <label htmlFor="ob-college">College</label>
          <select
            id="ob-college"
            className="ub-select"
            required
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          >
            <option value="">Select your college</option>
            {COLLEGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn--primary"
          type="submit"
          disabled={busy}
          style={{ width: "100%", marginTop: "4px" }}
        >
          {busy ? "Saving..." : "Continue to Urbook"}
        </button>
      </form>
    </div>
  );
}
