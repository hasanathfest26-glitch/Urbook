"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COLLEGES } from "@/lib/books";
import { createClient, supabaseEnabled } from "@/lib/supabase/client";

type AuthMode = "signup" | "login" | "verify" | "forgot";

const DEMO_ACCOUNTS = {
  aanya: {
    email: "aanya@du.ac.in",
    password: "UrbookDemo123!",
    name: "Aanya Sharma",
    college: "Delhi University",
  },
  rahul: {
    email: "rahul@iitd.ac.in",
    password: "UrbookDemo123!",
    name: "Rahul Mehta",
    college: "IIT Delhi",
  },
} as const;

export function AuthFlow({
  initialMode = "signup",
  nextPath = "/books",
  initialError = "",
}: {
  initialMode?: "signup" | "login";
  nextPath?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [otp, setOtp] = useState("123456");
  const [busy, setBusy] = useState<
    "" | "email" | "google" | "apple" | "verify" | "resend" | "demo"
  >("");
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/books";

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const signInDemoSession = async (
    presetKey: keyof typeof DEMO_ACCOUNTS,
    overrideProfile?: { name?: string; college?: string }
  ) => {
    const preset = DEMO_ACCOUNTS[presetKey];
    const supabase = createClient();
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: preset.email,
      password: preset.password,
    });

    if (signInErr || !data.user) {
      throw new Error(signInErr?.message ?? "Demo sign-in failed.");
    }

    if (overrideProfile?.name || overrideProfile?.college) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: overrideProfile.name?.trim() || preset.name,
        college: overrideProfile.college || preset.college,
        email_verified: true,
        updated_at: new Date().toISOString(),
      });
    }

    router.push(safeNext);
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError("");
    setNotice("");
    if (!supabaseEnabled) {
      setError("Supabase environment variables are missing.");
      return;
    }

    setBusy(provider);
    try {
      // Demo OAuth sign-in backed by confirmed Supabase student profiles
      await signInDemoSession(provider === "google" ? "aanya" : "rahul");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy("");
    }
  };

  const handleQuickDemo = async (presetKey: keyof typeof DEMO_ACCOUNTS) => {
    setError("");
    setNotice("");
    setBusy("demo");
    try {
      await signInDemoSession(presetKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed.");
      setBusy("");
    }
  };

  const handleEmailAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!supabaseEnabled) {
      setError("Supabase environment variables are missing.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Enter your email address.");
      return;
    }

    setBusy("email");
    try {
      const supabase = createClient();

      if (mode === "signup") {
        if (!fullName.trim() || !college) {
          setError("Enter your full name and select your college.");
          setBusy("");
          return;
        }

        // Move straight to verification step for smooth demo onboarding
        setEmail(cleanEmail);
        setOtp("123456");
        setMode("verify");
        setCooldown(45);
        setNotice(
          `Demo verification ready for ${cleanEmail}. Use code 123456 below to verify and enter Urbook.`
        );
        setBusy("");
        return;
      }

      if (mode === "login") {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (!signInError && data.user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("college")
            .eq("id", data.user.id)
            .maybeSingle();

          if (!prof?.college?.trim()) {
            router.push(`/onboarding?next=${encodeURIComponent(safeNext)}`);
          } else {
            router.push(safeNext);
          }
          router.refresh();
          return;
        }

        setError(
          signInError?.message ||
            "Invalid credentials. Try the one-click demo login below or sign up first."
        );
        setBusy("");
        return;
      }

      if (mode === "forgot") {
        setNotice(
          `Demo mode: use one-click demo login or sign up with any email.`
        );
        setBusy("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
      setBusy("");
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const code = otp.trim();
    if (code.length < 6) {
      setError("Enter the 6-digit demo code (123456).");
      return;
    }

    setBusy("verify");
    try {
      if (code === "123456") {
        await signInDemoSession("aanya", {
          name: fullName.trim() || "Aanya Sharma",
          college: college || "Delhi University",
        });
        return;
      }

      const supabase = createClient();
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "signup",
      });
      if (otpError) {
        setError("Enter demo code 123456 to complete verification.");
        setBusy("");
        return;
      }
      router.push(safeNext);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify code.");
      setBusy("");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    setCooldown(45);
    setOtp("123456");
    setNotice(`Demo verification code 123456 refreshed for ${email}.`);
  };

  if (mode === "verify") {
    return (
      <div className="ub-auth-wrap">
        <span className="ub-label">Demo email verification</span>
        <h1 style={{ fontSize: "clamp(28px, 3vw, 36px)", marginBottom: "12px" }}>
          Verify your email
        </h1>
        <p className="muted" style={{ marginBottom: "24px", lineHeight: 1.5 }}>
          Confirming student account for <strong>{email}</strong>.
        </p>

        {error && (
          <div
            className="ub-alert ub-alert--error"
            role="alert"
            style={{ marginBottom: "16px" }}
          >
            {error}
          </div>
        )}
        {notice && (
          <div
            className="ub-alert ub-alert--success"
            role="status"
            style={{ marginBottom: "16px" }}
          >
            {notice}
          </div>
        )}

        <form className="ub-form" onSubmit={handleVerifyOtp}>
          <div className="ub-field">
            <label htmlFor="otp-code">6-digit verification code (demo: 123456)</label>
            <input
              id="otp-code"
              className="ub-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            className="btn btn--primary"
            type="submit"
            disabled={busy === "verify"}
            style={{ width: "100%" }}
          >
            {busy === "verify" ? "Verifying..." : "Verify & continue"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginTop: "20px",
            fontSize: "var(--t-small)",
          }}
        >
          <button
            type="button"
            className="link"
            disabled={cooldown > 0 || busy === "resend"}
            onClick={handleResend}
            style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
          <button
            type="button"
            className="muted"
            onClick={() => {
              setMode("signup");
              setError("");
              setNotice("");
            }}
            style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
          >
            Use another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ub-auth-wrap">
      <div className="ub-tabs" role="tablist" aria-label="Account mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={`ub-tab${mode === "signup" ? " is-active" : ""}`}
          onClick={() => {
            setMode("signup");
            setError("");
            setNotice("");
          }}
        >
          Sign up
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`ub-tab${mode === "login" ? " is-active" : ""}`}
          onClick={() => {
            setMode("login");
            setError("");
            setNotice("");
          }}
        >
          Log in
        </button>
      </div>

      <span className="ub-label">
        {mode === "signup"
          ? "Demo student sign-up"
          : mode === "forgot"
          ? "Password reset"
          : "Demo student log-in"}
      </span>
      <h1 style={{ fontSize: "clamp(28px, 3vw, 36px)", marginBottom: "10px" }}>
        {mode === "signup"
          ? "Create your student account"
          : mode === "forgot"
          ? "Reset your password"
          : "Log in to Urbook"}
      </h1>
      <p className="muted" style={{ marginBottom: "24px", lineHeight: 1.5 }}>
        {mode === "signup"
          ? "Continue instantly with demo Google, Apple, or email verification to list books and message sellers."
          : mode === "forgot"
          ? "Use a one-click demo account below or sign up with any email."
          : "Sign in with a demo student profile or your saved credentials."}
      </p>

      {mode !== "forgot" && (
        <>
          <div className="ub-oauth-list">
            <button
              type="button"
              className="ub-oauth-btn"
              disabled={busy !== ""}
              onClick={() => handleOAuth("google")}
            >
              <img
                src="/assets/icons/google-icon.svg"
                alt=""
                width={20}
                height={20}
              />
              <span>
                {busy === "google"
                  ? "Signing in as Aanya..."
                  : "Continue with Google (Demo)"}
              </span>
            </button>
            <button
              type="button"
              className="ub-oauth-btn"
              disabled={busy !== ""}
              onClick={() => handleOAuth("apple")}
            >
              <img
                className="ic-ink"
                src="/assets/icons/apple.svg"
                alt=""
                width={17}
                height={20}
              />
              <span>
                {busy === "apple"
                  ? "Signing in as Rahul..."
                  : "Continue with Apple (Demo)"}
              </span>
            </button>
          </div>

          <div
            style={{
              marginTop: "12px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={busy !== ""}
              onClick={() => handleQuickDemo("aanya")}
              style={{ fontSize: "12px", height: "36px" }}
            >
              Demo: Aanya (DU)
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={busy !== ""}
              onClick={() => handleQuickDemo("rahul")}
              style={{ fontSize: "12px", height: "36px" }}
            >
              Demo: Rahul (IIT)
            </button>
          </div>

          <div className="ub-divider">or continue with email</div>
        </>
      )}

      {error && (
        <div
          className="ub-alert ub-alert--error"
          role="alert"
          style={{ marginBottom: "16px" }}
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          className="ub-alert ub-alert--success"
          role="status"
          style={{ marginBottom: "16px" }}
        >
          {notice}
        </div>
      )}

      <form className="ub-form" onSubmit={handleEmailAuth}>
        {mode === "signup" && (
          <>
            <div className="ub-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                className="ub-input"
                type="text"
                required
                autoComplete="name"
                placeholder="Aanya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="ub-field">
              <label htmlFor="auth-college">College</label>
              <select
                id="auth-college"
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
          </>
        )}

        <div className="ub-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="ub-input"
            type="email"
            required
            autoComplete="email"
            placeholder="aanya@du.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mode !== "forgot" && (
          <div className="ub-field">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label htmlFor="auth-password">Password</label>
              {mode === "login" && (
                <button
                  type="button"
                  className="muted"
                  style={{
                    background: "none",
                    border: 0,
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                    setNotice("");
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="auth-password"
              className="ub-input"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder={
                mode === "signup" ? "At least 8 characters" : "UrbookDemo123!"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <button
          className="btn btn--primary"
          type="submit"
          disabled={busy !== ""}
          style={{ width: "100%", marginTop: "4px" }}
        >
          {busy === "email"
            ? "Please wait..."
            : mode === "signup"
            ? "Create account"
            : mode === "forgot"
            ? "Show demo sign-in info"
            : "Log in"}
        </button>
      </form>

      {mode === "forgot" ? (
        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
          <button
            type="button"
            className="link"
            style={{ background: "none", border: 0, cursor: "pointer" }}
            onClick={() => {
              setMode("login");
              setError("");
              setNotice("");
            }}
          >
            Back to log in
          </button>
        </p>
      ) : (
        <p
          className="muted"
          style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}
        >
          By continuing you agree to our{" "}
          <Link className="link" href="/terms">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="link" href="/privacy">
            Privacy
          </Link>
          .
        </p>
      )}
    </div>
  );
}
