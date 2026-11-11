import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      className="footer closing footer--dark ground-inverse"
      id="contact"
      aria-labelledby="close-h"
    >
      <div className="wrap">
        <div className="closing__cta close--type">
          <div className="section-head">
            <h2 id="close-h">Pass your course books on this semester</h2>
            <p>
              Verify with email, Google, or Apple. List a textbook or message a
              seller on your campus.
            </p>
          </div>
          <Link
            className="btn btn--primary btn--xl btn--wide"
            href="/auth?mode=signup"
          >
            Create account
            <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
              <path className="m-arrow__stem" d="M1 6h8" />
              <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
            </svg>
          </Link>
        </div>

        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <Link className="nav__logo" href="/">
                urbook.
              </Link>
              <p className="footer__lede">
                Direct student-to-student textbook exchange across Indian
                campuses.
              </p>
            </div>
            <div className="span-2 footer__col">
              <h3>Browse</h3>
              <ul>
                <li>
                  <Link href="/books">Campus catalog</Link>
                </li>
                <li>
                  <Link href="/#shelf">Shelf preview</Link>
                </li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>How it works</h3>
              <ul>
                <li>
                  <Link href="/#how">Three steps</Link>
                </li>
                <li>
                  <Link href="/sell">List a book</Link>
                </li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Account</h3>
              <ul>
                <li>
                  <Link href="/auth?mode=signup">Sign up</Link>
                </li>
                <li>
                  <Link href="/auth?mode=login">Log in</Link>
                </li>
                <li>
                  <Link href="/account">My account</Link>
                </li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Questions</h3>
              <ul>
                <li>
                  <Link href="/#questions">Common answers</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__legal">
            <span>
              &copy; 2026 Urbook &nbsp; <Link href="/privacy">Privacy</Link>{" "}
              &nbsp; <Link href="/terms">Terms</Link>
            </span>
            <div className="socials" />
          </div>
        </div>
      </div>
    </footer>
  );
}
