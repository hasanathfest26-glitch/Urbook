import Link from "next/link";
import { TasteBoot } from "@/components/taste-boot";

export default function Home() {
  return (
    <main id="top">
      <TasteBoot />

      <section
        className="hero hero--collage"
        data-enter=""
        aria-labelledby="hero-h"
      >
        <div className="wrap">
          <div className="hero-text grid hero__grid">
            <div className="hero__text span-5">
              <h1 id="hero-h">Course book exchange for campus students</h1>
              <p className="hero__lead">
                Buy and sell used textbooks across 8 colleges at ₹0 platform fee.
                Verify your account first and arrange campus pickup in person.
              </p>
              <div className="btn-row">
                <Link className="btn btn--primary" href="/auth?mode=signup">
                  Create account
                  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                    <path className="m-arrow__stem" d="M1 6h8" />
                    <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
                  </svg>
                </Link>
                <Link className="btn btn--secondary" href="/books">
                  Browse books
                </Link>
              </div>
              <p className="hero__proof">
                Sign up with email verification, Google, or Apple.
              </p>
            </div>

            <div
              className="hero__art span-6 start-7"
              role="img"
              aria-label="Urbook campus shelf listing textbooks across Delhi University, IIT Delhi, and St. Stephen's College"
            >
              <div className="ly-piece ly-piece--main d-win" aria-hidden="true">
                <div className="d-win__bar">
                  <span className="d-win__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>urbook · Campus Shelf</span>
                </div>
                <div className="d-win__body">
                  <div className="d-side">
                    <span className="is-on">
                      <i />
                      All shelves
                    </span>
                    <span>
                      <i />
                      My college
                    </span>
                    <span>
                      <i />
                      Requests
                    </span>
                    <span>
                      <i />
                      My listings
                    </span>
                    <span className="d-side__label">Courses</span>
                    <span>
                      <i />
                      Engineering
                    </span>
                    <span>
                      <i />
                      Economics
                    </span>
                    <span>
                      <i />
                      Medicine
                    </span>
                  </div>
                  <div className="d-main">
                    <div className="d-main__head">
                      <h4>Available textbooks</h4>
                      <span className="d-btn">List a book</span>
                    </div>
                    <div className="d-tabs">
                      <span className="is-on">All courses</span>
                      <span>Engineering</span>
                      <span>Economics</span>
                    </div>
                    <div className="d-rows">
                      <div className="d-row">
                        <span className="d-thumb" style={{ background: "#264034" }}>
                          EM
                        </span>
                        <div>
                          <b>Engineering Math</b>
                          <small>B. S. Grewal · IIT Delhi</small>
                        </div>
                        <span className="num">₹320</span>
                        <span className="d-chip">Good</span>
                      </div>
                      <div className="d-row">
                        <span className="d-thumb" style={{ background: "#334a5e" }}>
                          MA
                        </span>
                        <div>
                          <b>Macroeconomics</b>
                          <small>Mankiw · Delhi Univ</small>
                        </div>
                        <span className="num">₹440</span>
                        <span className="d-chip">Like new</span>
                      </div>
                      <div className="d-row">
                        <span className="d-thumb" style={{ background: "#5a4738" }}>
                          PH
                        </span>
                        <div>
                          <b>Human Physiology</b>
                          <small>John E. Hall · Stephen&apos;s</small>
                        </div>
                        <span className="num">₹650</span>
                        <span className="d-chip">Like new</span>
                      </div>
                      <div className="d-row">
                        <span className="d-thumb" style={{ background: "#3d4d32" }}>
                          DS
                        </span>
                        <div>
                          <b>Data Structures in C</b>
                          <small>Reema Thareja · IIT Delhi</small>
                        </div>
                        <span className="num">₹375</span>
                        <span className="d-chip d-chip--low">Well read</span>
                      </div>
                      <div className="d-row">
                        <span className="d-thumb" style={{ background: "#4c3e4f" }}>
                          WN
                        </span>
                        <div>
                          <b>Wealth of Nations</b>
                          <small>Adam Smith · Delhi Univ</small>
                        </div>
                        <span className="num">₹280</span>
                        <span className="d-chip d-chip--low">Well read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="ly-piece ly-piece--note d-card"
                aria-hidden="true"
                data-ly-steps="700"
              >
                <div className="d-card__row">
                  <h5>Request to Rahul Mehta</h5>
                  <span className="d-chip" data-step="" data-step-at="4">
                    Sent
                  </span>
                </div>
                <div className="d-note__line" data-step="">
                  <i>✓</i>
                  <span>
                    <b>Engineering Math</b> · ₹320
                  </span>
                </div>
                <div className="d-note__line" data-step="">
                  <i>✓</i>
                  <span>
                    Student verified at <b>IIT Delhi</b>
                  </span>
                </div>
                <div className="d-note__line" data-step="">
                  <i>✓</i>
                  <span>
                    Pickup at <b>Main Library gate</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="shelf" aria-labelledby="shelf-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-5">
              <h2 id="shelf-h">Urbook book shelf and seller chat</h2>
            </div>
            <div className="span-6 start-7 stack-4">
              <p style={{ fontSize: "var(--t-lead)" }}>
                Filter available books by college, course, and condition. Inspect
                seller notes and send a direct pickup request without leaving
                the shelf.
              </p>
              <Link className="link" href="/books">
                Browse campus catalog
              </Link>
            </div>
          </div>

          <div
            className="ui app fill"
            role="img"
            aria-label="Urbook catalog list beside a direct buyer-to-seller pickup thread"
            data-ui-pause-host=""
          >
            <div className="app__pane app__pane--list">
              <div
                className="ui ui-panel ui-win"
                data-ui="window"
                data-open="Available"
                data-work="Pending"
                data-done="Sold"
              >
                <div className="ui-win__bar">
                  <span className="ui-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="ui-win__crumb">
                    Urbook <i>/</i> <b>Catalog</b>
                  </span>
                  <span className="ui-spacer" />
                  <span className="ui-win__search" aria-hidden="true">
                    <span className="ui-win__ph">Filter</span>
                    <span className="ui-kbd">/</span>
                  </span>
                </div>
                <div className="ui-win__body">
                  <nav className="ui-win__side" aria-hidden="true">
                    <span className="ui-win__nav is-on">
                      All books<em>18</em>
                    </span>
                    <span className="ui-win__nav">
                      IIT Delhi<em>7</em>
                    </span>
                    <span className="ui-win__nav">
                      Delhi Univ<em>6</em>
                    </span>
                    <span className="ui-win__nav">
                      St. Stephen&apos;s<em>5</em>
                    </span>
                    <span className="ui-win__label">Condition</span>
                    <span className="ui-win__nav">
                      <span className="ui-win__hash">#</span>Like new
                    </span>
                    <span className="ui-win__nav">
                      <span className="ui-win__hash">#</span>Good
                    </span>
                  </nav>
                  <div className="ui-win__main">
                    <div className="ui-win__cols" aria-hidden="true">
                      <span>Seller</span>
                      <span>Textbook</span>
                      <span>Status</span>
                      <span>Price</span>
                    </div>
                    <ul className="ui-win__rows">
                      <li className="ui-win__row" data-row="">
                        <span className="ui-avatar" data-tone="1">
                          RM
                        </span>
                        <span className="ui-win__who">Rahul Mehta</span>
                        <span className="ui-win__sub">
                          Engineering Math · IIT Delhi
                        </span>
                        <span className="ui-win__st" data-st="">
                          Available
                        </span>
                        <span className="ui-win__age">₹320</span>
                      </li>
                      <li className="ui-win__row" data-row="">
                        <span className="ui-avatar" data-tone="3">
                          MS
                        </span>
                        <span className="ui-win__who">Mira Shah</span>
                        <span className="ui-win__sub">
                          Macroeconomics · Delhi Univ
                        </span>
                        <span className="ui-win__st" data-st="">
                          Available
                        </span>
                        <span className="ui-win__age">₹440</span>
                      </li>
                      <li className="ui-win__row" data-row="">
                        <span className="ui-avatar" data-tone="4">
                          NK
                        </span>
                        <span className="ui-win__who">Neha Kapoor</span>
                        <span className="ui-win__sub">
                          Human Physiology · Stephen&apos;s
                        </span>
                        <span className="ui-win__st" data-st="">
                          Available
                        </span>
                        <span className="ui-win__age">₹650</span>
                      </li>
                      <li className="ui-win__row" data-row="">
                        <span className="ui-avatar" data-tone="2">
                          AD
                        </span>
                        <span className="ui-win__who">Arjun Das</span>
                        <span className="ui-win__sub">
                          Data Structures · IIT Delhi
                        </span>
                        <span className="ui-win__st is-you" data-st="">
                          Pending
                        </span>
                        <span className="ui-win__age">₹375</span>
                      </li>
                      <li className="ui-win__row" data-row="">
                        <span className="ui-avatar" data-tone="5">
                          IR
                        </span>
                        <span className="ui-win__who">Ishita Rao</span>
                        <span className="ui-win__sub">
                          Wealth of Nations · Delhi Univ
                        </span>
                        <span className="ui-win__st is-done" data-st="">
                          Sold
                        </span>
                        <span className="ui-win__age">₹280</span>
                      </li>
                      <li className="ui-win__row" data-row="">
                        <span className="ui-avatar" data-tone="3">
                          KS
                        </span>
                        <span className="ui-win__who">Kabir Singh</span>
                        <span className="ui-win__sub">
                          Brief History of Time · Delhi
                        </span>
                        <span className="ui-win__st" data-st="">
                          Available
                        </span>
                        <span className="ui-win__age">₹190</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="app__pane app__pane--open" data-ui-loop="">
              <div className="ui ui-panel ui-chat" data-ui="chat">
                <div className="ui-head">
                  <span className="ui-agent" aria-hidden="true" />
                  <div className="ui-title">Rahul Mehta · IIT Delhi</div>
                  <span className="ui-chat__online">Verified</span>
                  <span className="ui-spacer" />
                </div>
                <div className="ui-chat__body">
                  <div className="ui-chat__day">Engineering Math · ₹320</div>
                  <div className="ui-msg ui-msg--me" data-chat-q="">
                    <span className="ui-msg__text">
                      Hi Rahul, is the 44th edition still available for campus
                      pickup this week?
                    </span>
                  </div>
                  <div className="ui-msg ui-msg--bot" data-chat-a="">
                    <span className="ui-agent ui-msg__av" aria-hidden="true" />
                    <span className="ui-msg__col">
                      <span className="ui-chat__answer">
                        Yes, clean copy with light pencil notes. Meet outside{" "}
                        <b>Central Library at 4:30 PM</b>?
                      </span>
                      <span className="ui-chat__srcs">
                        <span className="ui-chat__src">Condition: Good</span>
                        <span className="ui-chat__src">In-person handoff</span>
                      </span>
                    </span>
                  </div>
                  <div className="ui-msg ui-msg--me">
                    <span className="ui-msg__text">
                      4:30 PM works. See you near the steps.
                    </span>
                  </div>
                </div>
                <div className="ui-chat__input">
                  <span className="ui-chat__ph">Send pickup message</span>
                  <span className="ui-chat__send" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14">
                      <path
                        d="M8 13V3.5M3.8 7.5 8 3.3l4.2 4.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section ground-surface"
        id="exchange"
        data-moment="word-highlight"
        aria-labelledby="exchange-h"
        suppressHydrationWarning
      >
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="exchange-h">Why students use Urbook</h2>
              <p className="mo-wh__text moment-statement" suppressHydrationWarning>
                Course books stay useful on campus, passed from{" "}
                <strong>one student</strong> to the next without store markups.
              </p>
              <Link className="link" href="/books">
                Explore campus books
              </Link>
            </div>
            <div
              className="frame frame--split frame--lit span-6 start-7"
              role="img"
              aria-label="Verified student pickup checklist"
            >
              <div className="stage stage--fade-b">
                <div
                  className="at-rise fit"
                  style={{
                    "--fit-max": "420px",
                    "--ax": "max(24px, 50% - 210px)",
                    "--ay": "44px",
                    "--ay-sm": "20px",
                  } as React.CSSProperties}
                >
                  <div className="ui ui-panel ui-checks" data-ui="checklist">
                    <div className="ui-checks__head">
                      <div className="ui-title">Campus handoff</div>
                      <span className="ui-spacer" />
                      <div className="ui-meta" data-checks-count="">
                        3 of 4
                      </div>
                    </div>
                    <div className="ui-checks__bar">
                      <i
                        data-checks-bar=""
                        style={{ "--k": 0.75 } as React.CSSProperties}
                      />
                    </div>
                    <ul className="ui-checks__list">
                      <li className="ui-check is-done">
                        <span className="ui-check__box">✓</span>
                        <span className="ui-check__label">
                          Email, Google, or Apple verified
                        </span>
                      </li>
                      <li className="ui-check is-done">
                        <span className="ui-check__box">✓</span>
                        <span className="ui-check__label">
                          Course and college selected
                        </span>
                      </li>
                      <li className="ui-check is-done">
                        <span className="ui-check__box">✓</span>
                        <span className="ui-check__label">
                          Direct seller request sent
                        </span>
                      </li>
                      <li className="ui-check">
                        <span className="ui-check__box" />
                        <span className="ui-check__label">
                          Inspect copy and pay in person
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how" aria-labelledby="how-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="how-h">
              Urbook workflow in 3 steps.{" "}
              <span className="muted">Verify once, browse every shelf.</span>
            </h2>
          </div>

          <div className="grid open-cards">
            <article className="card card--row">
              <span className="step-num">01</span>
              <h3>Verify student account</h3>
              <p>
                Sign up first with email confirmation, Google, or Apple so every
                message comes from a verified student.
              </p>
              <div
                className="panel panel--inset"
                role="img"
                aria-label="Account verification via Email, Google, and Apple"
              >
                <div className="stage">
                  <div
                    className="at-rise fit"
                    style={{
                      "--fit-max": "320px",
                      "--ax": "max(16px, 50% - 160px)",
                      "--ay": "24px",
                      "--ay-sm": "14px",
                    } as React.CSSProperties}
                    data-ui-loop=""
                  >
                    <div className="ui ui-notify" data-ui="notify">
                      <ul className="ui-notify__list" data-notify-list="">
                        <li className="ui-note">
                          <img
                            className="ic ic-24"
                            src="/assets/icons/google-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                          <span className="ui-note__text">
                            <span className="ui-note__title">
                              Google verified<time>now</time>
                            </span>
                            <span className="ui-note__body">
                              College set to IIT Delhi
                            </span>
                          </span>
                        </li>
                        <li className="ui-note">
                          <img
                            className="ic ic-24 ic-ink"
                            src="/assets/icons/apple.svg"
                            alt=""
                            width={20}
                            height={24}
                          />
                          <span className="ui-note__text">
                            <span className="ui-note__title">
                              Apple sign-in ready<time>1m</time>
                            </span>
                            <span className="ui-note__body">
                              One-tap verification active
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="card card--row">
              <span className="step-num">02</span>
              <h3>Search course books</h3>
              <p>
                Narrow course books by college, subject, condition, and price
                before messaging the seller.
              </p>
              <div
                className="panel panel--inset"
                role="img"
                aria-label="Catalog search filtering by title and course"
              >
                <div className="stage">
                  <div
                    className="at-rise fit"
                    style={{
                      "--fit-max": "320px",
                      "--ax": "max(16px, 50% - 160px)",
                      "--ay": "24px",
                      "--ay-sm": "12px",
                    } as React.CSSProperties}
                  >
                    <div className="ui ui-panel ui-search" data-ui="search">
                      <div className="ui-search__field">
                        <span className="ui-search__q">
                          <span data-search-q="">engineering math</span>
                          <i className="ui-search__caret" />
                        </span>
                        <kbd className="ui-search__kbd">IIT</kbd>
                      </div>
                      <div className="ui-search__group">Matching books</div>
                      <ul className="ui-search__list" data-search-list="">
                        <li className="ui-search__row is-sel">
                          <span className="ui-search__t">
                            <b>Engineering</b> Math
                          </span>
                          <span className="ui-search__m">₹320</span>
                        </li>
                        <li className="ui-search__row">
                          <span className="ui-search__t">Data Structures</span>
                          <span className="ui-search__m">₹375</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="card card--row">
              <span className="step-num">03</span>
              <h3>List and sell books</h3>
              <p>
                Publish your textbook in a minute, review buyer requests, and
                mark copies sold once handed over.
              </p>
              <div
                className="panel panel--inset"
                role="img"
                aria-label="Listing status from available to sold"
              >
                <div className="stage">
                  <div
                    className="at-rise fit"
                    style={{
                      "--fit-max": "320px",
                      "--ax": "max(16px, 50% - 160px)",
                      "--ay": "24px",
                      "--ay-sm": "12px",
                    } as React.CSSProperties}
                  >
                    <div className="ui ui-panel ui-checks" data-ui="checklist">
                      <div className="ui-checks__head">
                        <div className="ui-title">Listing status</div>
                        <span className="ui-spacer" />
                        <div className="ui-meta" data-checks-count="">
                          2 of 3
                        </div>
                      </div>
                      <div className="ui-checks__bar">
                        <i
                          data-checks-bar=""
                          style={{ "--k": 0.67 } as React.CSSProperties}
                        />
                      </div>
                      <ul className="ui-checks__list">
                        <li className="ui-check is-done">
                          <span className="ui-check__box">✓</span>
                          <span className="ui-check__label">
                            Listed at ₹320
                          </span>
                        </li>
                        <li className="ui-check is-done">
                          <span className="ui-check__box">✓</span>
                          <span className="ui-check__label">
                            Pickup request sent
                          </span>
                        </li>
                        <li className="ui-check">
                          <span className="ui-check__box" />
                          <span className="ui-check__label">
                            Mark copy sold
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="section ground-surface"
        id="questions"
        aria-labelledby="questions-h"
      >
        <div className="wrap">
          <div className="grid">
            <div className="span-5 stack-4">
              <h2 id="questions-h">Questions</h2>
              <p>
                How student verification, messaging, and listings work on Urbook.
              </p>
              <Link className="link" href="/auth?mode=signup">
                Sign up for Urbook
              </Link>
              <div
                className="panel ub-faq-panel"
                role="img"
                aria-label="Google, Apple, and email verification options"
              >
                <div className="stage">
                  <div
                    className="at-rise fit"
                    style={{
                      "--fit-max": "360px",
                      "--ax": "max(16px, 50% - 180px)",
                      "--ay": "18px",
                      "--ay-sm": "14px",
                    } as React.CSSProperties}
                  >
                    <div className="ui ui-notify" data-ui="notify">
                      <ul className="ui-notify__list" data-notify-list="">
                        <li className="ui-note">
                          <img
                            className="ic ic-24"
                            src="/assets/icons/google-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                          <span className="ui-note__text">
                            <span className="ui-note__title">
                              Google OAuth<time>instant</time>
                            </span>
                            <span className="ui-note__body">
                              Continue with your Gmail account
                            </span>
                          </span>
                        </li>
                        <li className="ui-note">
                          <img
                            className="ic ic-24 ic-ink"
                            src="/assets/icons/apple.svg"
                            alt=""
                            width={20}
                            height={24}
                          />
                          <span className="ui-note__text">
                            <span className="ui-note__title">
                              Apple ID<time>instant</time>
                            </span>
                            <span className="ui-note__body">
                              Private sign-in supported
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="span-6 start-7 faq">
              <div className="faq__item">
                <h3>How student account verification works</h3>
                <p>
                  Sign up with email and password (link plus 6-digit code) or
                  continue directly with Google or Apple.
                </p>
              </div>
              <div className="faq__item">
                <h3>Browsing campus books without signing in</h3>
                <p>
                  Public visitors can search the catalog anytime. Sign up is
                  prompted when you message a seller or list a book.
                </p>
              </div>
              <div className="faq__item">
                <h3>Urbook exchange fees and pickup</h3>
                <p>
                  Listings cost ₹0. Pay the seller directly in person when you
                  inspect the textbook on campus.
                </p>
              </div>
              <div className="faq__item">
                <h3>Marking sold books in Urbook</h3>
                <p>
                  Mark any book sold from My account so it clears from the
                  public catalog immediately.
                </p>
              </div>
              <div className="faq__item">
                <h3>Supported colleges in the catalog</h3>
                <p>
                  Students can filter and list across Delhi University, IIT
                  Delhi, St. Stephen&apos;s College, Hindu College, Miranda
                  House, DTU, NSUT, and Ashoka.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
