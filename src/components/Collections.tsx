import Link from "next/link";
import { collections, fromPrice, taka } from "@/lib/catalog";
import { CaseArt } from "./CaseArt";
import styles from "./Collections.module.css";

export function Collections() {
  return (
    <section id="collections" className={styles.section} aria-labelledby="collections-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="collections-title" className="title">
            Shop by material
          </h2>
          <Link href="/collections" className="textLink">
            See all collections
          </Link>
        </div>

        <ul className={styles.grid}>
          {collections.map((collection, index) => (
            <li key={collection.id} className={styles.tile} data-feature={index === 0}>
              <div className={styles.text}>
                <h3 className={styles.name}>
                  <Link href={collection.href} className={styles.link}>
                    {collection.name}
                  </Link>
                </h3>
                <p className={styles.blurb}>{collection.blurb}</p>
                <p className={styles.from}>From {taka(fromPrice(collection.id))}</p>
              </div>
              <div className={styles.art}>
                <CaseArt finish={collection.cover} className={styles.case} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
