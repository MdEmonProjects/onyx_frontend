import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getProduct } from "@/lib/catalog";
import type { ProductReview } from "@/lib/productReviews";

/*
 * Product reviews, stored in data/reviews.json.
 *
 * Good enough for a single Node server (`next start`, a VPS, cPanel Node).
 * On serverless hosts (Vercel, Netlify) the file system is read-only, so
 * swap readAll / writeAll for a database before deploying there.
 */

const FILE = path.join(process.cwd(), "data", "reviews.json");

async function readAll(): Promise<ProductReview[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as ProductReview[];
  } catch {
    return [];
  }
}

async function writeAll(reviews: ProductReview[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(reviews, null, 2), "utf8");
}

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("product");
  if (!productId) return Response.json({ error: "Missing product" }, { status: 400 });

  const reviews = (await readAll())
    .filter((r) => r.productId === productId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return Response.json({ reviews });
}

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const productId = clean(body.productId, 80);
  const rating = Number(body.rating);
  const name = clean(body.name, 60);
  const title = clean(body.title, 100);
  const text = clean(body.text, 2000);
  const device = clean(body.device, 80);

  if (!getProduct(productId)) return Response.json({ error: "Unknown product" }, { status: 400 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return Response.json({ error: "Pick a rating from 1 to 5 stars." }, { status: 400 });
  if (name.length < 2) return Response.json({ error: "Please add your name." }, { status: 400 });
  if (text.length < 10)
    return Response.json({ error: "Please write at least a sentence (10 characters)." }, { status: 400 });

  const review: ProductReview = {
    id: randomUUID(),
    productId,
    rating,
    name,
    title,
    text,
    device,
    createdAt: new Date().toISOString(),
  };

  const all = await readAll();
  all.push(review);
  await writeAll(all);

  return Response.json({ review }, { status: 201 });
}
