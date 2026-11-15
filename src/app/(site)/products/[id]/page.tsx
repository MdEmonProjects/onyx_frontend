import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductBuy } from "@/components/product/ProductBuy";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RelatedRail } from "@/components/product/RelatedRail";
import { ReviewsProvider } from "@/components/product/ReviewsProvider";
import {
  collections,
  getProduct,
  productDescription,
  productGallery,
  productSpecs,
  products,
  relatedProducts,
} from "@/lib/catalog";
import styles from "./page.module.css";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}: ${product.material}. Cases for iPhone, Samsung and Google phones, delivered across Bangladesh.`,
  };
}

/**
 * The page itself never reads `params`: with partial prefetching the App Shell
 * is shared by every product link, so the URL-specific part renders inside
 * <Suspense> and only the stone band below is in the shell.
 */
export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <Suspense
      fallback={
        <div className={styles.top}>
          <div className="wrap">
            <ProductSkeleton />
          </div>
        </div>
      }
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/products/[id]">, "params">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const collection = collections.find((c) => c.id === product.collection);

  return (
    <ReviewsProvider key={product.id} productId={product.id}>
      <div className={styles.top}>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              {collection && (
                <li>
                  <Link href={collection.href}>{collection.name}</Link>
                </li>
              )}
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <ProductBuy
            product={product}
            photos={productGallery(product)}
            description={productDescription(product)}
            specs={productSpecs(product)}
          />
        </div>
      </div>

      <ProductReviews productId={product.id} productName={product.name} />

      <section className={styles.related} aria-labelledby="related-title">
        <div className="wrap">
          <RelatedRail products={relatedProducts(product, 8)} />
        </div>
      </section>
    </ReviewsProvider>
  );
}
