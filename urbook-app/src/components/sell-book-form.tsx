"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BOOK_SHADES, COLLEGES, CONDITIONS, COURSES, type BookCondition } from "@/lib/books";
import { createClient } from "@/lib/supabase/client";

export function SellBookForm({
  userId,
  defaultCollege,
}: {
  userId: string;
  defaultCollege: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<BookCondition>("Good");
  const [college, setCollege] = useState(defaultCollege || COLLEGES[0]);
  const [course, setCourse] = useState<string>(COURSES[0]);
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const parsedPrice = Number(price);
    if (!title.trim() || !author.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a title, author, and valid price above ₹0.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      let coverUrl: string | null = null;

      if (coverFile) {
        const ext = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("book-images")
          .upload(path, coverFile, { upsert: false });

        if (uploadError) {
          setError(`Cover upload failed: ${uploadError.message}`);
          setBusy(false);
          return;
        }
        const { data: urlData } = supabase.storage
          .from("book-images")
          .getPublicUrl(path);
        coverUrl = urlData.publicUrl;
      }

      const shade = BOOK_SHADES[Math.floor(Math.random() * BOOK_SHADES.length)];
      const { error: insertError } = await supabase.from("books").insert({
        seller_id: userId,
        title: title.trim(),
        author: author.trim(),
        price: Math.round(parsedPrice),
        condition,
        college,
        course,
        description: description.trim() || "Used course book in clean reading order.",
        shade,
        cover_url: coverUrl,
        status: "available",
      });

      if (insertError) {
        setError(insertError.message);
        setBusy(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish listing.");
      setBusy(false);
    }
  };

  return (
    <form className="ub-panel ub-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ub-alert ub-alert--error" role="alert">
          {error}
        </div>
      )}

      <div className="ub-field">
        <label htmlFor="sell-title">Book title</label>
        <input
          id="sell-title"
          className="ub-input"
          type="text"
          required
          placeholder="e.g. Principles of Economics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="ub-field">
        <label htmlFor="sell-author">Author</label>
        <input
          id="sell-author"
          className="ub-input"
          type="text"
          required
          placeholder="N. Gregory Mankiw"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className="ub-form-row">
        <div className="ub-field">
          <label htmlFor="sell-price">Price (₹)</label>
          <input
            id="sell-price"
            className="ub-input"
            type="number"
            inputMode="numeric"
            min={1}
            required
            placeholder="350"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="ub-field">
          <label htmlFor="sell-condition">Condition</label>
          <select
            id="sell-condition"
            className="ub-select"
            value={condition}
            onChange={(e) => setCondition(e.target.value as BookCondition)}
          >
            {CONDITIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ub-form-row">
        <div className="ub-field">
          <label htmlFor="sell-college">College</label>
          <select
            id="sell-college"
            className="ub-select"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          >
            {COLLEGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="ub-field">
          <label htmlFor="sell-course">Course</label>
          <select
            id="sell-course"
            className="ub-select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            {COURSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ub-field">
        <label htmlFor="sell-cover">Cover photo (optional)</label>
        <input
          id="sell-cover"
          className="ub-input"
          type="file"
          accept="image/*"
          style={{ paddingTop: "10px" }}
          onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="ub-field">
        <label htmlFor="sell-desc">Notes on edition or markings</label>
        <textarea
          id="sell-desc"
          className="ub-textarea"
          placeholder="Edition year, pencil highlights, or campus pickup spot."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className="btn btn--primary" type="submit" disabled={busy}>
        {busy ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}
