import "server-only";
import { BOOK_SHADES, type Book, type BookCondition, type BookRequestItem } from "@/lib/books";
import { createServerClientForRequest } from "@/lib/supabase/server";

type RawBookRow = {
  id: string;
  seller_id: string;
  title: string;
  author: string;
  price: number;
  college: string;
  course: string;
  condition: string;
  description: string | null;
  shade: string | null;
  cover_url: string | null;
  status: "available" | "sold";
  created_at: string;
  profiles: {
    full_name: string;
    college: string;
    email_verified: boolean;
  } | null;
};

function mapBook(row: RawBookRow, index = 0): Book {
  const condition: BookCondition =
    row.condition === "Like new" || row.condition === "Good" || row.condition === "Well read"
      ? row.condition
      : "Good";
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    author: row.author,
    price: row.price,
    college: row.college,
    course: row.course,
    condition,
    description: row.description ?? "Used course copy in clean reading order.",
    shade: row.shade || BOOK_SHADES[index % BOOK_SHADES.length],
    coverUrl: row.cover_url,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    sellerName: row.profiles?.full_name ?? "Urbook student",
    sellerCollege: row.profiles?.college || row.college,
    sellerVerified: Boolean(row.profiles?.email_verified),
  };
}

export async function getPublicBooks(): Promise<Book[]> {
  const supabase = await createServerClientForRequest();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("books")
    .select(
      "id,seller_id,title,author,price,college,course,condition,description,shade,cover_url,status,created_at,profiles(full_name,college,email_verified)"
    )
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as RawBookRow[]).map((row, index) => mapBook(row, index));
}

export async function getBookById(id: string): Promise<Book | null> {
  const supabase = await createServerClientForRequest();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("books")
    .select(
      "id,seller_id,title,author,price,college,course,condition,description,shade,cover_url,status,created_at,profiles(full_name,college,email_verified)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapBook(data as unknown as RawBookRow);
}

type RawRequestRow = {
  id: string;
  book_id: string;
  buyer_id: string;
  seller_id: string;
  message: string;
  buyer_contact: string | null;
  status: "sent" | "replied" | "closed";
  created_at: string;
  books: { title: string; price: number } | null;
  buyer: { full_name: string; college: string } | null;
  seller: { full_name: string; college: string } | null;
};

export async function getUserMarketplaceData(userId: string): Promise<{
  listings: Book[];
  incomingRequests: BookRequestItem[];
  outgoingRequests: BookRequestItem[];
}> {
  const supabase = await createServerClientForRequest();
  if (!supabase) {
    return { listings: [], incomingRequests: [], outgoingRequests: [] };
  }

  const [booksRes, reqRes] = await Promise.all([
    supabase
      .from("books")
      .select(
        "id,seller_id,title,author,price,college,course,condition,description,shade,cover_url,status,created_at,profiles(full_name,college,email_verified)"
      )
      .eq("seller_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("book_requests")
      .select(
        "id,book_id,buyer_id,seller_id,message,buyer_contact,status,created_at,books(title,price),buyer:profiles!book_requests_buyer_id_fkey(full_name,college),seller:profiles!book_requests_seller_id_fkey(full_name,college)"
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false }),
  ]);

  const listings = (booksRes.data as unknown as RawBookRow[] | null)?.map((r, i) => mapBook(r, i)) ?? [];
  const allRequests = ((reqRes.data as unknown as RawRequestRow[] | null) ?? []).map(
    (r): BookRequestItem => ({
      id: r.id,
      bookId: r.book_id,
      bookTitle: r.books?.title ?? "Course book",
      bookPrice: r.books?.price ?? 0,
      buyerId: r.buyer_id,
      buyerName: r.buyer?.full_name ?? "Student buyer",
      buyerCollege: r.buyer?.college ?? "",
      sellerId: r.seller_id,
      sellerName: r.seller?.full_name ?? "Student seller",
      sellerCollege: r.seller?.college ?? "",
      message: r.message,
      buyerContact: r.buyer_contact,
      status: r.status,
      createdAt: new Date(r.created_at).getTime(),
    })
  );

  return {
    listings,
    incomingRequests: allRequests.filter((r) => r.sellerId === userId),
    outgoingRequests: allRequests.filter((r) => r.buyerId === userId),
  };
}
