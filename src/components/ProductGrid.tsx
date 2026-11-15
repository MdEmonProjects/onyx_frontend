import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

export function ProductGrid() {
  return (
    <section id="best-sellers" className={styles.section} aria-labelledby="best-sellers-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="best-sellers-title" className="title">
            Best sellers
          </h2>
          <Link href="/shop" className="textLink">
            Shop all cases
          </Link>
        </div>

        <ul className={styles.grid}>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
