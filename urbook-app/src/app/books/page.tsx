import Link from "next/link";
import { Suspense } from "react";
import { getPublicBooks } from "@/lib/books-service";
import { BooksCatalog } from "@/components/books-catalog";

async function CatalogContent() {
  const books = await getPublicBooks();
  return <BooksCatalog initialBooks={books} />;
}

export default function BooksPage() {
  return (
    <main id="top" className="ub-page">
      <div className="wrap">
        <div className="ub-head">
          <div>
            <span className="ub-label">Campus shelf</span>
            <h1 className="ub-head__title">Course books from students</h1>
            <p className="ub-head__sub">
              Filter by college, course, and condition, then message the student
              who listed the copy.
            </p>
          </div>
          <Link className="btn btn--primary" href="/sell">
            List a book
          </Link>
        </div>

        <Suspense
          fallback={
            <p className="muted" style={{ marginTop: "32px" }}>
              Loading campus books...
            </p>
          }
        >
          <CatalogContent />
        </Suspense>
      </div>
    </main>
  );
}
