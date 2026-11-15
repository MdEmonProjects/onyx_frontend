import type { Metadata, Viewport } from "next";

// Self-hosted fonts (no request to Google at build time or in the browser).
// HarmonyOS Sans (see globals.css) carries the text, Archivo only the logo,
// and Hind Siliguri supplies the taka sign.
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/hind-siliguri/bengali-500.css";
import "@fontsource/hind-siliguri/bengali-600.css";
import "./globals.css";

import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollEffects } from "@/components/ScrollEffects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_BD",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#353839",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions (IDM, Grammarly, password managers…) add attributes to
    // <html>/<body> before React loads; this silences only those two tags.
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <a href="#main" className="skip">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ScrollEffects />
        </CartProvider>
      </body>
    </html>
  );
}
