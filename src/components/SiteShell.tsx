import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollEffects } from "./ScrollEffects";

/**
 * The storefront's frame: cart, header, footer and smooth scrolling. Used by
 * the (site) layout and the 404 page; /admin has its own frame instead.
 *
 * Returns siblings (no wrapper) so the footer stays a direct child of <body>;
 * ProductBuy watches `body > footer` for its sticky add-to-cart bar.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ScrollEffects />
    </CartProvider>
  );
}
