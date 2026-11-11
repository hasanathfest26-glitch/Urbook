import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urbook: Course book exchange for campus students",
  description:
    "Buy and sell used course textbooks directly with verified students at your college.",
  openGraph: {
    type: "website",
    title: "Urbook: Course book exchange for campus students",
    description:
      "Buy and sell used course textbooks directly with verified students at your college.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urbook: Course book exchange for campus students",
    description:
      "Buy and sell used course textbooks directly with verified students at your college.",
  },
};

const TASTE_ROOT_CSS = `:root {
  --p-bg: #0f0f0f;
  --p-surface: #1a1a1a;
  --p-ink: #ffffff;
  --p-muted: #b0b0b0;
  --p-accent: #dafa9c;
  --p-accent-ink: #0f0f0f;
  --p-action: #dafa9c;
  --p-action-ink: #0f0f0f;
  --p-inv-bg: #ffffff;
  --p-inv-surface: #ececec;
  --p-inv-ink: #0f0f0f;
  --p-inv-muted: #525252;
  --p-inv-accent: #0f0f0f;
  --p-inv-accent-ink: #ffffff;
  --p-inv-action: #0f0f0f;
  --p-inv-action-ink: #ffffff;
  --font-display: "Instrument Sans", system-ui, sans-serif;
  --font-text: "Instrument Sans", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 500;
  --display-tracking: -0.028em;
  --display-tracking-xl: -0.036em;
  --display-stretch: 96%;
  --ly-scale: 1.04;
}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="soft"
      data-ground="sky"
      data-buttons="solid"
      data-motion=""
    >
      <head>
        <meta name="site-kind" content="software" />
        <meta name="page-type" content="software" />
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/system.css" />
        <link rel="stylesheet" href="/assets/ui/cards.css" />
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <link rel="stylesheet" href="/assets/backgrounds/backgrounds.css" />
        <link rel="stylesheet" href="/assets/layout/layout.css" />
        <link rel="stylesheet" href="/assets/icons/icon.css" />
        <link rel="stylesheet" href="/assets/ui/base.css" />
        <link rel="stylesheet" href="/assets/ui/window/fragment.css" />
        <link rel="stylesheet" href="/assets/ui/chat/fragment.css" />
        <link rel="stylesheet" href="/assets/ui/checklist/fragment.css" />
        <link rel="stylesheet" href="/assets/ui/search/fragment.css" />
        <link rel="stylesheet" href="/assets/ui/notify/fragment.css" />
        <link
          rel="stylesheet"
          href="/assets/moments/word-highlight/moment.css"
        />
        <style dangerouslySetInnerHTML={{ __html: TASTE_ROOT_CSS }} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700);document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500);",
          }}
        />
        <Script
          src="/assets/backgrounds/backgrounds.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Suspense
          fallback={
            <header className="nav nav--centre">
              <div className="wrap nav__bar">
                <a className="nav__logo" href="/">
                  urbook<span style={{ color: "var(--accent)" }}>.</span>
                </a>
              </div>
            </header>
          }
        >
          <SiteHeader />
        </Suspense>

        {children}

        <SiteFooter />

        <script type="module" src="/assets/system.js" />
        <script type="module" src="/assets/motion/motion.js" />
        <script type="module" src="/assets/layout/layout.js" />
      </body>
    </html>
  );
}
