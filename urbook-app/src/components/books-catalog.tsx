"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COLLEGES, CONDITIONS, COURSES, type Book } from "@/lib/books";

export function BooksCatalog({ initialBooks }: { initialBooks: Book[] }) {
  const [query, setQuery] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("default");

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = initialBooks.filter((book) => {
      if (q && !`${book.title} ${book.author} ${book.course}`.toLowerCase().includes(q)) {
        return false;
      }
      if (college && book.college !== college) return false;
      if (course && book.course !== course) return false;
      if (condition && book.condition !== condition) return false;
      return true;
    });

    if (sort === "low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sort === "high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [initialBooks, query, college, course, condition, sort]);

  const hasFilters = Boolean(query || college || course || condition || sort !== "default");

  return (
    <>
      <div className="ub-filters">
        <div className="ub-searchbox ub-filters__search">
          <svg
            className="ub-searchbox__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            aria-label="Search textbooks"
            className="ub-input"
            type="search"
            placeholder="Search title, author, or subject"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by college"
          className="ub-select"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        >
          <option value="">All colleges</option>
          {COLLEGES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by course"
          className="ub-select"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">All courses</option>
          {COURSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by condition"
          className="ub-select"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort books"
          className="ub-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort: default</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <div className="ub-meta-bar">
        <span>
          {visibleBooks.length} {visibleBooks.length === 1 ? "book" : "books"} available
        </span>
        {hasFilters && (
          <button
            type="button"
            className="link"
            style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
            onClick={() => {
              setQuery("");
              setCollege("");
              setCourse("");
              setCondition("");
              setSort("default");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {visibleBooks.length === 0 ? (
        <div className="ub-empty">
          <h2 style={{ fontSize: "24px", margin: 0 }}>
            {initialBooks.length === 0
              ? "No books listed on campus yet"
              : "No textbooks match those filters"}
          </h2>
          <p>
            {initialBooks.length === 0
              ? "Be the first student to pass a textbook on this semester."
              : "Clear a filter or search with a shorter title or author name."}
          </p>
          <div className="btn-row">
            <Link className="btn btn--primary" href="/sell">
              List a book
            </Link>
            {hasFilters && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setQuery("");
                  setCollege("");
                  setCourse("");
                  setCondition("");
                  setSort("default");
                }}
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="ub-book-grid">
          {visibleBooks.map((book) => (
            <article key={book.id} className="ub-book">
              <Link className="ub-book__link" href={`/books/${book.id}`}>
                <div
                  className="ub-book__cover"
                  style={{ background: book.shade }}
                >
                  {book.coverUrl && (
                    <img src={book.coverUrl} alt={book.title} loading="lazy" />
                  )}
                  <span className="ub-book__badge">{book.condition}</span>
                  {!book.coverUrl && (
                    <span className="ub-book__cover-title">{book.title}</span>
                  )}
                </div>
                <div className="ub-book__body">
                  <h2 className="ub-book__title">{book.title}</h2>
                  <p className="ub-book__author">
                    {book.author} · {book.course}
                  </p>
                  <div className="ub-book__foot">
                    <strong className="ub-book__price">₹{book.price}</strong>
                    <span className="ub-book__college">{book.college}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
