"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, UserIcon } from "./Icons";
import styles from "./MobileMenu.module.css";

type Props = { open: boolean; onClose: () => void };

/**
 * Mobile menu drawer. Slides in from the left over the page; the items
 * fade in one after another. An item with children opens a second panel
 * that slides in from the right, with a Back button to return.
 */
export function MobileMenu({ open, onClose }: Props) {
  const [subId, setSubId] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    onClose();
    // Reset to the top level once the drawer has slid away.
    window.setTimeout(() => setSubId(null), 350);
  };

  const sub = mainNav.find((item) => item.id === subId);

  return (
    <div className={styles.root} data-open={open}>
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      <div
        id="mobile-menu"
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <div className={styles.top}>
          <button ref={closeButton} type="button" className={styles.close} onClick={close}>
            <CloseIcon />
            <span className="srOnly">Close menu</span>
          </button>
        </div>

        <div className={styles.panels} data-sub={sub !== undefined} data-lenis-prevent>
          {/* Top level */}
          <div className={styles.main} inert={sub !== undefined}>
            <nav aria-label="Mobile">
              <ul className={styles.list}>
                {mainNav.map((item, i) => (
                  <li key={item.id} style={{ "--i": i } as React.CSSProperties}>
                    {item.groups ? (
                      <button
                        type="button"
                        className={`${styles.item} ${styles.animated}`}
                        aria-expanded={subId === item.id}
                        onClick={() => setSubId(item.id)}
                      >
                        <span>{item.label}</span>
                        <ChevronRightIcon />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`${styles.item} ${styles.animated}`}
                        onClick={close}
                      >
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className={`${styles.utility} ${styles.animated}`}
              style={{ "--i": mainNav.length } as React.CSSProperties}
            >
              <Link href="/account" className={styles.utilityLink} onClick={close}>
                <UserIcon />
                Log in
              </Link>
              <p className={styles.locale}>Bangladesh (BDT ৳)</p>
              <p className={styles.small}>{site.announcement}</p>
            </div>
          </div>

          {/* Submenu */}
          <div className={styles.sub} inert={sub === undefined}>
            {sub && (
              <>
                <button type="button" className={styles.back} onClick={() => setSubId(null)}>
                  <ChevronLeftIcon />
                  <span>{sub.label}</span>
                </button>

                <Link href={sub.href} className={styles.viewAll} onClick={close}>
                  {sub.allLabel ?? `View all ${sub.label}`}
                </Link>

                {sub.groups?.map((group) => (
                  <div key={group.title} className={styles.group}>
                    <p className={styles.groupTitle}>{group.title}</p>
                    <ul>
                      {group.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href} className={styles.subLink} onClick={close}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
