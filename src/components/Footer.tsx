import Link from "next/link";
import { collections, models } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

const help = [
  { label: "Delivery", href: "/help/delivery" },
  { label: "Exchanges and returns", href: "/help/exchanges" },
  { label: "Track an order", href: "/track" },
  { label: "Contact us", href: "/contact" },
];

export function Footer() {
  const { whatsapp, email, instagram, facebook } = site.contact;

  return (
    <footer className={`${styles.footer} onDark`}>
      <div className="wrap">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size="large" />
            <p className={styles.tagline}>Premium iPhone cases, delivered across Bangladesh.</p>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            <div>
              <h2 className={styles.heading}>Shop by iPhone</h2>
              <ul className={styles.links}>
                {models.slice(0, 6).map((model) => (
                  <li key={model.id}>
                    <Link href={`/shop/${model.id}`}>{model.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/shop">All models</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={styles.heading}>Collections</h2>
              <ul className={styles.links}>
                {collections.map((collection) => (
                  <li key={collection.id}>
                    <Link href={collection.href}>{collection.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={styles.heading}>Help</h2>
              <ul className={styles.links}>
                {help.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={styles.heading}>Talk to us</h2>
              <ul className={styles.links}>
                {whatsapp && (
                  <li>
                    <a href={`https://wa.me/${whatsapp}`}>WhatsApp</a>
                  </li>
                )}
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
                <li>
                  <a href={instagram}>Instagram</a>
                </li>
                <li>
                  <a href={facebook}>Facebook</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>
            © 2026 {site.name}. All Rights Reserved | Designed and Developed by{" "}
            <a href="https://virtualgarage.io/" target="_blank" rel="noopener" className={styles.credit}>
              Virtual Garage
            </a>
          </p>
          <ul className={styles.legal}>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
