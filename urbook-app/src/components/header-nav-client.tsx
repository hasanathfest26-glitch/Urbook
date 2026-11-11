"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/auth-server";

export function HeaderNavClient({ profile }: { profile: UserProfile | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    document.body.classList.remove("nav-locked");
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    return () => document.body.classList.remove("nav-locked");
  }, [open]);

  const initial = (profile?.fullName?.[0] ?? "U").toUpperCase();

  return (
    <header className={`nav nav--centre${open ? " is-open" : ""}`}>
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <Link className="nav__logo" href="/" onClick={() => setOpen(false)}>
          urbook<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          <div className="nav__item">
            <Link
              className="nav__link"
              href="/books"
              aria-current={pathname.startsWith("/books") ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Browse
            </Link>
          </div>
          <div className="nav__item">
            <Link
              className="nav__link"
              href="/#how"
              onClick={() => setOpen(false)}
            >
              How it works
            </Link>
          </div>
          <div className="nav__item">
            <Link
              className="nav__link"
              href="/#questions"
              onClick={() => setOpen(false)}
            >
              Questions
            </Link>
          </div>
          <div className="nav__item">
            <Link
              className="nav__link"
              href="/sell"
              aria-current={pathname === "/sell" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Sell
            </Link>
          </div>
        </nav>

        <div className="nav__actions">
          {profile ? (
            <>
              <Link
                className="ub-nav-pill"
                href="/account"
                aria-current={pathname === "/account" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="ub-nav-pill__dot">{initial}</span>
                <span>Account</span>
              </Link>
              <Link
                className="btn btn--primary"
                href="/sell"
                onClick={() => setOpen(false)}
              >
                List a book
              </Link>
            </>
          ) : (
            <>
              <Link
                className="nav__link"
                href="/auth?mode=login"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                className="btn btn--primary"
                href="/auth?mode=signup"
                onClick={() => setOpen(false)}
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M2 5h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
