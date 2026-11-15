/**
 * Sample catalogue. Names, prices and colours are placeholders: replace
 * them with real products, or load them from your backend / CMS and keep
 * the same shapes.
 */

/* ---------- iPhone models ---------- */

/** Which camera cut-out the case needs. */
export type Camera = "plateau" | "island" | "pill" | "bar";

export type Model = {
  id: string;
  name: string;
  /** Label used on the picker chips. */
  short: string;
  camera: Camera;
  /** Pro Max sized phones are drawn slightly bigger. */
  large?: boolean;
};

export const models: Model[] = [
  { id: "iphone-18-pro-max", name: "iPhone 18 Pro Max", short: "18 Pro Max", camera: "plateau", large: true },
  { id: "iphone-18-pro", name: "iPhone 18 Pro", short: "18 Pro", camera: "plateau" },
  { id: "iphone-air", name: "iPhone Air", short: "Air", camera: "bar" },
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", short: "17 Pro Max", camera: "plateau", large: true },
  { id: "iphone-17-pro", name: "iPhone 17 Pro", short: "17 Pro", camera: "plateau" },
  { id: "iphone-17", name: "iPhone 17", short: "17", camera: "pill" },
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", short: "16 Pro Max", camera: "island", large: true },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", short: "16 Pro", camera: "island" },
  { id: "iphone-16", name: "iPhone 16", short: "16", camera: "pill" },
];

export const defaultModel = models[1];

/* ---------- Finishes ---------- */

export type Pattern = "banded" | "weave" | "leather" | "clear" | "matte";

export type Finish = {
  id: string;
  name: string;
  pattern: Pattern;
  /** Main colour of the case. */
  base: string;
  /** Second colour: the bands, the weave thread, the stitching. */
  tone: string;
};

const f = (pattern: Pattern, name: string, base: string, tone: string): Finish => ({
  id: `${pattern}-${name.toLowerCase().replace(/\s+/g, "-")}`,
  name,
  pattern,
  base,
  tone,
});

/* ---------- Collections ---------- */

export type CollectionId = "banded" | "aramid" | "leather" | "clear" | "everyday";

export type Collection = {
  id: CollectionId;
  name: string;
  blurb: string;
  href: string;
  /** Finish shown on the home page tile. */
  cover: Finish;
};

export const collections: Collection[] = [
  {
    id: "banded",
    name: "Banded stone",
    blurb: "Our signature finish, veined like the stone we are named after. No two colours band the same way.",
    href: "/collections/banded",
    cover: f("banded", "Sardonyx", "#6B2531", "#EBDAD3"),
  },
  {
    id: "aramid",
    name: "Aramid fibre",
    blurb: "Thin, light and woven, with a dry technical feel.",
    href: "/collections/aramid",
    cover: f("weave", "Black", "#1E1F20", "#5A5E60"),
  },
  {
    id: "leather",
    name: "Leather",
    blurb: "Full-grain hides that darken with use.",
    href: "/collections/leather",
    cover: f("leather", "Tan", "#9C6B44", "#EBD4BA"),
  },
  {
    id: "clear",
    name: "Clear with MagSafe",
    blurb: "Shows off the iPhone's own colour.",
    href: "/collections/clear",
    cover: f("clear", "On glacier", "#A9BCC7", "#FFFFFF"),
  },
];

/* ---------- Categories (home page grid) ---------- */

/** Which drawing a tile shows while it has no photo. */
export type CategoryArtKind =
  | "cases"
  | "straps"
  | "magsafe"
  | "watch"
  | "earbuds"
  | "gift"
  | "travel"
  | "tablet"
  | "laptop";

/** Tile grounds, all from the site palette. */
export type CategoryTone = "onyx" | "sard" | "honed" | "white";

export type Category = {
  id: string;
  name: string;
  /** One short line under the name. */
  blurb: string;
  href: string;
  /** Wide tiles span two columns of the grid. */
  wide?: boolean;
  tone: CategoryTone;
  art: CategoryArtKind;
  /**
   * Optional photo inside /public, e.g. "/categories/phone-cases.jpg".
   * When set it replaces the drawing and covers the whole tile.
   */
  image?: string;
  /**
   * "light" for bright photos: dark text, no shading. Leave it out for dark
   * photos, which get light text over a soft shadow.
   */
  imageTone?: "light" | "dark";
  /** CSS object-position for the photo, e.g. "65% center". Default: centred. */
  imagePosition?: string;
  /** Optional tag on the tile, e.g. "11.11 Sale". */
  badge?: string;
};

/**
 * Order matters: the grid has four columns and wide tiles take two, so
 * each row should add up to four (wide + 1 + 1, or 1 + 1 + wide).
 */
/*
 * Every tile shows a real photo. To go back to the drawn tiles, delete a
 * tile's image / imageTone / imagePosition lines: it falls back to its
 * `art` drawing automatically (CategoryArt.tsx is kept for this).
 */
export const categories: Category[] = [
  {
    id: "phone-cases",
    name: "Phone cases",
    blurb: "Stone, aramid, leather and clear.",
    href: "/category/phone-cases",
    wide: true,
    tone: "onyx",
    art: "cases",
    image: "/images/10009.jpeg",
    imageTone: "light",
    imagePosition: "65% center",
    badge: "11.11 Sale",
  },
  {
    id: "phone-straps",
    name: "Phone straps",
    blurb: "Clip-on, cross-body.",
    href: "/category/phone-straps",
    tone: "honed",
    art: "straps",
    image: "/images/10001.jpeg",
    imageTone: "light",
    imagePosition: "20% center",
    badge: "11.11 Sale",
  },
  {
    id: "magsafe",
    name: "MagSafe",
    blurb: "Grips, stands, wallets.",
    href: "/category/magsafe",
    tone: "white",
    art: "magsafe",
    image: "/images/10005.jpeg",
    imageTone: "light",
    imagePosition: "center bottom",
    badge: "11.11 Sale",
  },
  {
    id: "watch-bands",
    name: "Watch bands",
    blurb: "For every Apple Watch.",
    href: "/category/watch-bands",
    tone: "white",
    art: "watch",
    image: "/images/10003.jpeg",
    imageTone: "light",
  },
  {
    id: "earbuds-cases",
    name: "AirPods cases",
    blurb: "With a carry clip.",
    href: "/category/earbuds-cases",
    tone: "honed",
    art: "earbuds",
    image: "/images/10002.jpeg",
    imageTone: "dark",
  },
  {
    id: "gift-guide",
    name: "Gift guide",
    blurb: "Wrapped and delivered across Bangladesh.",
    href: "/category/gift-guide",
    wide: true,
    tone: "sard",
    art: "gift",
    image: "/images/10006.jpeg",
    imageTone: "dark",
    imagePosition: "65% center",
  },
  {
    id: "travel",
    name: "Travel",
    blurb: "Passport sleeves and cable pouches.",
    href: "/category/travel",
    wide: true,
    tone: "honed",
    art: "travel",
    image: "/images/10007.jpeg",
    imageTone: "light",
    imagePosition: "65% center",
  },
  {
    id: "tablet-cases",
    name: "iPad cases",
    blurb: "Folios with a pencil slot.",
    href: "/category/tablet-cases",
    tone: "white",
    art: "tablet",
    image: "/images/10004.jpeg",
    imageTone: "light",
  },
  {
    id: "laptop-cases",
    name: "Laptop sleeves",
    blurb: "For MacBook Air and Pro.",
    href: "/category/laptop-cases",
    tone: "onyx",
    art: "laptop",
    image: "/images/10010.jpeg",
    imageTone: "dark",
  },
];

/** Finishes used by the drawn category tiles: the store's own materials. */
export const categoryFinishes = {
  sardonyx: f("banded", "Sardonyx", "#6B2531", "#EBDAD3"),
  aramid: f("weave", "Black", "#1E1F20", "#5A5E60"),
  tan: f("leather", "Tan", "#9C6B44", "#EBD4BA"),
  clear: f("clear", "On glacier", "#A9BCC7", "#FFFFFF"),
  onyx: f("banded", "Onyx", "#353839", "#B9BDBC"),
  chalk: f("matte", "Chalk", "#E9E8E3", "#9A9E9D"),
};

/* ---------- Products ---------- */

export type Product = {
  id: string;
  name: string;
  collection: CollectionId;
  material: string;
  /** Price in taka. */
  price: number;
  isNew?: boolean;
  finishes: Finish[];
  /**
   * Optional product photo, e.g. "/products/banded-onyx.jpg" inside /public.
   * When set, the card shows the photo instead of the drawn case.
   */
  image?: string;
  /** Photos for the product page gallery, inside /public. */
  gallery?: string[];
  /** Product page description. Falls back to the collection's text below. */
  description?: string;
  /** Set to true to show "Sold out" and switch off the add-to-cart button. */
  soldOut?: boolean;
};

export const products: Product[] = [
  {
    id: "banded",
    name: "Banded",
    collection: "banded",
    material: "Stone-finish shell",
    price: 2450,
    isNew: true,
    finishes: [
      f("banded", "Onyx", "#2A2C2D", "#ECECE7"),
      f("banded", "Sardonyx", "#6B2531", "#EBDAD3"),
      f("banded", "Bone", "#E3E1DA", "#5F6263"),
      f("banded", "Glacier", "#9DB2BE", "#F2F6F7"),
      f("banded", "Moss", "#3F4B3D", "#D2D7C6"),
    ],
  },
  {
    id: "aramid-weave",
    name: "Aramid Weave",
    collection: "aramid",
    material: "Aramid fibre",
    price: 3200,
    finishes: [
      f("weave", "Black", "#1E1F20", "#5A5E60"),
      f("weave", "Ink", "#1F2836", "#5B6E88"),
      f("weave", "Forest", "#1E2A23", "#557060"),
    ],
  },
  {
    id: "saddle",
    name: "Saddle",
    collection: "leather",
    material: "Full-grain leather",
    price: 2900,
    finishes: [
      f("leather", "Tan", "#9C6B44", "#EBD4BA"),
      f("leather", "Espresso", "#3E2B23", "#B3927C"),
      f("leather", "Burgundy", "#5C202A", "#D6ADAD"),
      f("leather", "Black", "#232425", "#8D9192"),
    ],
  },
  {
    id: "frost-clear",
    name: "Frost Clear",
    collection: "clear",
    material: "Clear shell, MagSafe ring",
    price: 1450,
    finishes: [
      f("clear", "On glacier", "#A9BCC7", "#FFFFFF"),
      f("clear", "On silver", "#CDD0D2", "#FFFFFF"),
      f("clear", "On burgundy", "#6B2531", "#FFFFFF"),
      f("clear", "On black", "#2B2D2F", "#FFFFFF"),
    ],
  },
  {
    id: "strata",
    name: "Strata",
    collection: "banded",
    material: "Stone-finish shell",
    price: 2650,
    isNew: true,
    finishes: [
      f("banded", "Jade", "#2E5148", "#E2ECDD"),
      f("banded", "Lapis", "#213257", "#DEE6F3"),
      f("banded", "Rose quartz", "#D8B5AD", "#FFF8F4"),
    ],
  },
  {
    id: "slate",
    name: "Slate",
    collection: "everyday",
    material: "Soft-touch matte shell",
    price: 1250,
    finishes: [
      f("matte", "Bone", "#E3E1DA", "#5F6263"),
      f("matte", "Onyx", "#2F3132", "#8D9192"),
      f("matte", "Glacier", "#9DB2BE", "#F2F6F7"),
      f("matte", "Moss", "#4A5747", "#D2D7C6"),
      f("matte", "Sardonyx", "#6B2531", "#EBDAD3"),
    ],
  },
  {
    id: "aramid-tint",
    name: "Aramid Tint",
    collection: "aramid",
    material: "Aramid fibre, coloured thread",
    price: 3450,
    finishes: [
      f("weave", "Ember", "#201C1C", "#9A3B45"),
      f("weave", "Brass", "#1F1E1B", "#A98A4E"),
      f("weave", "Glacier", "#1C2023", "#7FA0B3"),
    ],
  },
  {
    id: "stitch",
    name: "Stitch",
    collection: "leather",
    material: "Leather, contrast stitching",
    price: 3100,
    finishes: [
      f("leather", "Moss", "#49553F", "#E6E2CF"),
      f("leather", "Bone", "#DDD6C8", "#3A3D3E"),
      f("leather", "Ink", "#232F47", "#D9DEE8"),
    ],
  },
];

/** Finishes offered in the hero picker: the signature Banded case. */
export const heroProduct = products[0];

export function fromPrice(collection: CollectionId): number {
  return Math.min(...products.filter((p) => p.collection === collection).map((p) => p.price));
}

/** 2450 -> "৳2,450" */
export function taka(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}

/* ---------- Product page: devices, case types, specs ---------- */

export type Device = { id: string; name: string; camera?: Camera };
export type Brand = { id: string; name: string; devices: Device[] };

/**
 * Brand -> model picker on the product page. Apple uses the iPhone list
 * above. The Samsung and Google lists are SAMPLES: keep only the phones
 * you actually make cases for.
 */
export const brands: Brand[] = [
  {
    id: "apple",
    name: "Apple",
    devices: models.map((m) => ({ id: m.id, name: m.name, camera: m.camera })),
  },
  {
    id: "samsung",
    name: "Samsung",
    devices: [
      { id: "galaxy-s26-ultra", name: "Galaxy S26 Ultra" },
      { id: "galaxy-s26-plus", name: "Galaxy S26+" },
      { id: "galaxy-s26", name: "Galaxy S26" },
      { id: "galaxy-s25-ultra", name: "Galaxy S25 Ultra" },
    ],
  },
  {
    id: "google",
    name: "Google",
    devices: [
      { id: "pixel-10-pro-xl", name: "Pixel 10 Pro XL" },
      { id: "pixel-10-pro", name: "Pixel 10 Pro" },
      { id: "pixel-10", name: "Pixel 10" },
    ],
  },
];

export type CaseType = {
  id: string;
  name: string;
  note: string;
  /** Added to the product's base price. */
  extra: number;
};

/** Sample case builds and surcharges. Adjust to the real range. */
export const caseTypes: CaseType[] = [
  { id: "slim", name: "Slim Case", note: "Thin and light for everyday carry.", extra: 0 },
  { id: "impact", name: "Impact Case", note: "Raised edges and cushioned corners.", extra: 500 },
  { id: "impact-magsafe", name: "Impact Case with MagSafe", note: "Impact build with a magnet ring.", extra: 900 },
];

/** Spec rows for the product page. SAMPLE values: check each one. */
const collectionSpecs: Record<CollectionId, [string, string][]> = {
  banded: [
    ["Material", "Stone-finish polycarbonate shell, TPU bumper"],
    ["Finish", "Banded, no two cases alike"],
    ["Lining", "Microfibre"],
  ],
  aramid: [
    ["Material", "Aramid fibre, unidirectional weave"],
    ["Finish", "Matte, dry touch"],
    ["Lining", "None (bare fibre)"],
  ],
  leather: [
    ["Material", "Full-grain leather over a polycarbonate frame"],
    ["Finish", "Ages and darkens with use"],
    ["Lining", "Microfibre"],
  ],
  clear: [
    ["Material", "Anti-yellowing polycarbonate, TPU edges"],
    ["Finish", "Gloss clear"],
    ["Lining", "None"],
  ],
  everyday: [
    ["Material", "Soft-touch polycarbonate"],
    ["Finish", "Matte"],
    ["Lining", "Microfibre"],
  ],
};

export function productSpecs(product: Product): [string, string][] {
  return [
    ...collectionSpecs[product.collection],
    ["Wireless charging", "Supported"],
    ["Buttons", "Covered, tactile click"],
    ["Camera", "Raised lip around the lens"],
    ["In the box", "Case, cleaning cloth"],
  ];
}

/** Description shown on the product page. SAMPLE copy: rewrite it per collection or per product. */
const collectionDescriptions: Record<CollectionId, string> = {
  banded:
    "Our signature finish, veined like the stone we are named after. No two colours band the same way, so every case looks a little different.",
  aramid: "Woven aramid fibre: thin and light, with a dry technical feel in the hand.",
  leather: "Full-grain leather over a rigid frame. It darkens and softens with use, so it looks better the longer you carry it.",
  clear: "A clear shell that shows off the phone's own colour, with a MagSafe ring built in.",
  everyday: "A soft-touch matte shell for everyday carry: easy to grip and easy to wipe clean.",
};

export function productDescription(product: Product): string {
  return product.description ?? collectionDescriptions[product.collection];
}

/** Sample photos for the gallery while products have no shoot of their own. */
const sampleGallery = [
  "/images/10001.jpeg",
  "/images/10002.jpeg",
  "/images/10003.jpeg",
  "/images/10004.jpeg",
  "/images/10005.jpeg",
];

export function productGallery(product: Product): string[] {
  if (product.gallery?.length) return product.gallery;
  const start = products.indexOf(product) % sampleGallery.length;
  return [0, 1, 2].map((i) => sampleGallery[(start + i) % sampleGallery.length]);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Same collection first, then the rest. */
export function relatedProducts(product: Product, count = 4): Product[] {
  const others = products.filter((p) => p.id !== product.id);
  const same = others.filter((p) => p.collection === product.collection);
  const rest = others.filter((p) => p.collection !== product.collection);
  return [...same, ...rest].slice(0, count);
}
