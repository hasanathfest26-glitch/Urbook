import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCurrentProfile } from "@/lib/auth-server";
import { getBookById } from "@/lib/books-service";
import { ContactSellerForm } from "@/components/contact-seller-form";

async function BookDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [book, profile] = await Promise.all([getBookById(id), getCurrentProfile()]);

  if (!book) {
    notFound();
  }

  return (
    <>
      <Link className="link" href="/books">
        ← Back to books
      </Link>

      <div className="ub-split">
        <div
          className="ub-book__cover"
          style={{
            background: book.shade,
            height: "420px",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--line)",
          }}
        >
          {book.coverUrl && <img src={book.coverUrl} alt={book.title} />}
          <span className="ub-book__badge">{book.condition}</span>
          {!book.coverUrl && (
            <span
              className="ub-book__cover-title"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              {book.title}
            </span>
          )}
        </div>

        <div>
          <span className="ub-label">
            {book.course} · {book.college}
          </span>
          <h1 className="ub-head__title" style={{ marginBottom: "10px" }}>
            {book.title}
          </h1>
          <p className="muted" style={{ fontSize: "var(--t-lead)" }}>
            by {book.author}
          </p>

          <p
            style={{
              marginTop: "24px",
              font: "500 32px/1 var(--font-mono)",
              color: "var(--accent)",
            }}
          >
            ₹{book.price}
          </p>

          <p
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid var(--line)",
              lineHeight: 1.6,
              color: "var(--ink)",
            }}
          >
            {book.description}
          </p>

          <div
            className="ub-panel"
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 20px",
            }}
          >
            <span className="ub-avatar">
              {(book.sellerName?.[0] ?? "S").toUpperCase()}
            </span>
            <div>
              <strong style={{ display: "block", fontWeight: 500 }}>
                {book.sellerName}
              </strong>
              <span className="muted" style={{ fontSize: "13px" }}>
                {book.sellerCollege}
              </span>
            </div>
            {book.sellerVerified && (
              <span
                className="ub-chip ub-chip--verified"
                style={{ marginLeft: "auto" }}
              >
                Verified student
              </span>
            )}
          </div>

          <ContactSellerForm
            bookId={book.id}
            sellerId={book.sellerId}
            sellerName={book.sellerName}
            currentUserId={profile?.id ?? null}
            currentUserEmail={profile?.email ?? null}
          />
        </div>
      </div>
    </>
  );
}

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main id="top" className="ub-page">
      <div className="wrap">
        <Suspense fallback={<p className="muted">Loading book details...</p>}>
          <BookDetailContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
