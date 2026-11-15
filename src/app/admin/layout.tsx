import type { Metadata } from "next";
import Link from "next/link";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Onyx Q admin" },
  robots: { index: false, follow: false },
};

/**
 * The admin's own frame, separate from the shop's header and footer. The
 * pages inside render in the browser and talk to /api/admin/*.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          Onyx Q <span>Admin</span>
        </Link>
        <Link href="/" className={styles.storeLink}>
          View store ↗
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
