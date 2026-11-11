export type BookCondition = "Like new" | "Good" | "Well read";
export type BookStatus = "available" | "sold";

export type Book = {
  id: string;
  sellerId: string;
  title: string;
  author: string;
  price: number;
  college: string;
  course: string;
  condition: BookCondition;
  description: string;
  shade: string;
  coverUrl: string | null;
  status: BookStatus;
  createdAt: number;
  sellerName: string;
  sellerCollege: string;
  sellerVerified: boolean;
};

export type BookRequestItem = {
  id: string;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  buyerId: string;
  buyerName: string;
  buyerCollege: string;
  sellerId: string;
  sellerName: string;
  sellerCollege: string;
  message: string;
  buyerContact: string | null;
  status: "sent" | "replied" | "closed";
  createdAt: number;
};

export const COLLEGES = [
  "Delhi University",
  "IIT Delhi",
  "St. Stephen's College",
  "Hindu College",
  "Miranda House",
  "DTU",
  "NSUT",
  "Ashoka University",
] as const;

export const COURSES = [
  "Engineering",
  "Computer Science",
  "Economics",
  "Medicine",
  "Literature",
  "Commerce",
  "Mathematics",
] as const;

export const CONDITIONS: BookCondition[] = ["Like new", "Good", "Well read"];

export const BOOK_SHADES = [
  "#264034",
  "#334a5e",
  "#5a4738",
  "#3d4d32",
  "#4c3e4f",
  "#6b4739",
] as const;
