"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { taka, type Product } from "@/lib/catalog";
import { AddToCartButton } from "./AddToCartButton";
import { CaseArt } from "./CaseArt";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const [finish, setFinish] = useState(product.finishes[0]);
  const href = `/products/${product.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {product.isNew && <span className={styles.tag}>New</span>}
        <Link href={href} className={styles.mediaLink} tabIndex={-1} aria-hidden="true">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(max-width: 760px) 50vw, (max-width: 1080px) 33vw, 25vw"
              className={styles.photo}
            />
          ) : (
            <CaseArt finish={finish} className={styles.case} />
          )}
        </Link>
        <AddToCartButton
          compact
          itemName={`${product.name} in ${finish.name}`}
          className={styles.add}
          line={{ productId: product.id, finishId: finish.id }}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className={styles.price}>{taka(product.price)}</p>
        <p className={styles.material}>{product.material}</p>

        <fieldset className={styles.finishes}>
          <legend className="srOnly">{product.name} colour</legend>
          {product.finishes.map((option) => (
            <label key={option.id} className={styles.swatch}>
              <input
                type="radio"
                name={`finish-${product.id}`}
                checked={option.id === finish.id}
                onChange={() => setFinish(option)}
                className="srOnly"
              />
              <span
                className={styles.dot}
                style={{
                  background:
                    option.pattern === "matte" || option.pattern === "clear"
                      ? option.base
                      : `linear-gradient(135deg, ${option.base} 0 40%, ${option.tone} 40% 56%, ${option.base} 56%)`,
                }}
              />
              <span className="srOnly">{option.name}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </article>
  );
}
