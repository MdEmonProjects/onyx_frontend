/**
 * Store-wide settings.
 *
 * Everything in this file is sample copy. Check each line against how the
 * business really runs (delivery times, payment methods, exchange window,
 * contact details) before the site goes live.
 */
export const site = {
  name: "Onyx Q",
  domain: "onyxqbd.com",
  url: "https://onyxqbd.com",
  title: "Onyx Q | Premium iPhone cases in Bangladesh",
  description:
    "Premium iPhone cases in stone finishes, aramid fibre and leather, for iPhone 16 through iPhone 18 Pro Max. Delivered across Bangladesh.",

  announcement: "Cash on delivery anywhere in Bangladesh",

  /** Messages that scroll across the black bar above the header. */
  announcements: [
    { text: "Cash on delivery anywhere in Bangladesh", href: "/help#payment" },
    { text: "Cases for iPhone 16 through iPhone 18 Pro Max", href: "/shop" },
    { text: "7-day exchange on every case", href: "/help#exchange" },
  ],

  services: [
    {
      icon: "truck",
      title: "Delivery across Bangladesh",
      text: "Inside Dhaka in 1 to 2 days. Other districts in 3 to 5.",
    },
    {
      icon: "wallet",
      title: "Pay the way you like",
      text: "Cash on delivery, bKash, Nagad or card.",
    },
    {
      icon: "swap",
      title: "7-day exchange",
      text: "Wrong model or changed your mind? Swap it within 7 days.",
    },
    {
      icon: "chat",
      title: "Help on WhatsApp",
      text: "Ask us which case fits. We reply every day, 10 am to 10 pm.",
    },
  ],

  contact: {
    // Replace with the real number, e.g. "8801XXXXXXXXX" (no plus sign).
    whatsapp: "",
    email: "hello@onyxqbd.com",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export type ServiceIcon = (typeof site.services)[number]["icon"];
