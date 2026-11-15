import { collections, models } from "./catalog";

/**
 * Main menu, shared by the desktop header (dropdown panels) and the
 * mobile drawer (slide-in submenus). An item with `groups` opens a panel;
 * an item without is a plain link.
 */
export type NavLink = { label: string; href: string; note?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** First link in the mobile submenu, pointing at `href`. */
  allLabel?: string;
  groups?: NavGroup[];
};

const modelLinks = (test: (id: string) => boolean): NavLink[] =>
  models
    .filter((m) => test(m.id))
    .map((m) => ({ label: m.name, href: `/shop?model=${m.id}` }));

export const mainNav: NavItem[] = [
  { id: "best-sellers", label: "Best sellers", href: "/#best-sellers" },
  {
    id: "iphone",
    label: "iPhone Cases",
    href: "/shop",
    allLabel: "Shop all iPhone cases",
    groups: [
      {
        title: "iPhone 18 series",
        links: modelLinks((id) => id.startsWith("iphone-18") || id === "iphone-air"),
      },
      { title: "iPhone 17 series", links: modelLinks((id) => id.startsWith("iphone-17")) },
      { title: "iPhone 16 series", links: modelLinks((id) => id.startsWith("iphone-16")) },
      {
        title: "Shop",
        links: [
          { label: "All iPhone cases", href: "/shop" },
          { label: "Best sellers", href: "/#best-sellers" },
        ],
      },
    ],
  },
  {
    id: "collections",
    label: "Collections",
    href: "/#materials",
    allLabel: "All collections",
    groups: [
      {
        title: "By material",
        links: collections.map((c) => ({ label: c.name, href: c.href, note: c.blurb })),
      },
    ],
  },
  { id: "materials", label: "Materials", href: "/#materials" },
  {
    id: "help",
    label: "Help",
    href: "/help",
    allLabel: "Help centre",
    groups: [
      {
        title: "Customer care",
        links: [
          { label: "Delivery", href: "/help#delivery" },
          { label: "Payment", href: "/help#payment" },
          { label: "Exchanges", href: "/help#exchange" },
          { label: "Contact us", href: "/help#contact" },
        ],
      },
    ],
  },
];
