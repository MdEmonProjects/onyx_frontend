import { SiteShell } from "@/components/SiteShell";

/** Storefront pages get the shop header and footer; /admin doesn't. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
