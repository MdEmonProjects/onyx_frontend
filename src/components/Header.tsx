"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { BagIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

/**
 * Fixed header.
 *
 * On the home page it sits transparent over the hero, and its text takes
 * the colour the active slide asks for (the hero writes that onto <html>).
 * Once the page scrolls it turns white and the announcement bar folds away;
 * the menu bar stays in view the whole time.
 */
export function Header() {
  const pathname = usePathname();
  const overlayPage = pathname === "/";
  const { count } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [megaId, setMegaId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!megaId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaId]);

  const solid = !overlayPage || scrolled || megaId !== null;
  const megaItem = mainNav.find((item) => item.id === megaId);

  return (
    <>
      <div className={styles.spacer} data-overlay={overlayPage} aria-hidden="true" />

      <header
        className={styles.header}
        data-solid={solid}
        data-scrolled={scrolled}
        onMouseLeave={() => setMegaId(null)}
      >
        <div className={styles.announcement} inert={scrolled}>
          <div className={styles.marquee}>
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.marqueeGroup} aria-hidden={copy === 1}>
                {site.announcements.map((a) => (
                  <Link
                    key={a.text}
                    href={a.href}
                    className={styles.marqueeItem}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    {a.text}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bar}>
          <div className={styles.primary}>
            <button
              ref={menuButton}
              type="button"
              className={styles.menuButton}
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
              <span className="srOnly">Open menu</span>
            </button>
            <Logo />
          </div>

          <nav className={styles.nav} aria-label="Main">
            <ul className={styles.navList}>
              {mainNav.map((item) => (
                <li
                  key={item.id}
                  className={styles.navItem}
                  onMouseEnter={() => setMegaId(item.groups ? item.id : null)}
                >
                  {item.groups ? (
                    <button
                      type="button"
                      className={styles.navLink}
                      aria-expanded={megaId === item.id}
                      aria-controls="mega-panel"
                      data-active={megaId === item.id}
                      onClick={(e) =>
                        // Mouse clicks land after hover already opened the panel, so they
                        // only open it; keyboard presses (detail 0) toggle it.
                        setMegaId((id) => (e.detail === 0 && id === item.id ? null : item.id))
                      }
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link href={item.href} className={styles.navLink}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link href="/search" className={styles.icon}>
              <SearchIcon />
              <span className="srOnly">Search</span>
            </Link>
            <Link href="/account" className={`${styles.icon} ${styles.desktopOnly}`}>
              <UserIcon />
              <span className="srOnly">Account</span>
            </Link>
            <Link href="/cart" className={styles.icon}>
              <BagIcon />
              <span className="srOnly">Cart,</span>
              <span className={styles.count} data-empty={count === 0} aria-live="polite">
                {count}
                <span className="srOnly"> {count === 1 ? "item" : "items"}</span>
              </span>
            </Link>
          </div>
        </div>

        <div
          id="mega-panel"
          className={styles.mega}
          data-open={megaItem !== undefined}
          inert={megaItem === undefined}
        >
          {megaItem?.groups && (
            <div className={styles.megaInner} key={megaItem.id}>
              {megaItem.groups.map((group) => (
                <div key={group.title} className={styles.megaGroup}>
                  <p className={styles.megaTitle}>{group.title}</p>
                  <ul className={styles.megaLinks}>
                    {group.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          className={styles.megaLink}
                          onClick={() => setMegaId(null)}
                        >
                          {link.label}
                          {link.note && <span className={styles.megaNote}>{link.note}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <MobileMenu
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          menuButton.current?.focus();
        }}
      />
    </>
  );
}
