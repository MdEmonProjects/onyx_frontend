import Link from "next/link";
import styles from "./Logo.module.css";

/**
 * Type-only wordmark: "Onyx" beside a Q set inside a case-shaped outline.
 * Replace the contents with an <Image> when the final logo file is ready.
 */
export function Logo({ size = "regular" }: { size?: "regular" | "large" }) {
  return (
    <Link href="/" className={styles.logo} data-size={size} aria-label="Onyx Q, home">
      <span>Onyx</span>
      <span className={styles.q}>Q</span>
    </Link>
  );
}
