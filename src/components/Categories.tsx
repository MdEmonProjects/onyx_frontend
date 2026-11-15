import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { CategoryArt } from "./CategoryArt";
import styles from "./Categories.module.css";

export function Categories() {
  return (
    <section id="categories" className={styles.section} aria-labelledby="categories-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="categories-title" className="title">
            Shop by category
          </h2>
          <Link href="/shop" className="textLink">
            Shop all
          </Link>
        </div>

        <ul className={styles.grid}>
          {categories.map((category) => (
            <li
              key={category.id}
              className={styles.tile}
              data-wide={category.wide ?? false}
              data-tone={category.tone}
              data-photo={category.image ? (category.imageTone ?? "dark") : undefined}
            >
              <div className={styles.art}>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    className={styles.photo}
                    style={category.imagePosition ? { objectPosition: category.imagePosition } : undefined}
                    sizes={
                      category.wide
                        ? "(max-width: 900px) 100vw, 50vw"
                        : "(max-width: 900px) 50vw, 25vw"
                    }
                  />
                ) : (
                  <CategoryArt kind={category.art} />
                )}
              </div>

              <div className={styles.text}>
                <h3 className={styles.name}>
                  <Link href={category.href} className={styles.link}>
                    {category.name}
                  </Link>
                </h3>
                <p className={styles.blurb}>{category.blurb}</p>
              </div>

              {category.badge && <p className={styles.tag}>{category.badge}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
