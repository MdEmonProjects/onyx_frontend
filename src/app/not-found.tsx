import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

/*
 * Renders inside the bare root layout (unmatched URLs and notFound() calls
 * both land here), so it brings the shop's header and footer itself.
 */
export default function NotFound() {
  return (
    <SiteShell>
      <section className="onDark" style={{ background: "var(--onyx)" }}>
      <div
        className="wrap"
        style={{ paddingBlock: "clamp(96px, 16vw, 200px)", display: "grid", gap: 24, justifyItems: "start" }}
      >
        <h1 className="display">We can&apos;t find that page.</h1>
        <p style={{ maxWidth: "40ch", color: "var(--band-soft)" }}>
          The link may be old, or the page may not be built yet. The cases are all on the home page.
        </p>
        <Link href="/" className="btn btnLight">
          Go to the home page
        </Link>
      </div>
      </section>
    </SiteShell>
  );
}
