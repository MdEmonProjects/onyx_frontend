# Onyx Q store: home page

Home page for onyxqbd.com, a premium iPhone case store for Bangladesh.
Built with Next.js 16 (App Router), React 19 and TypeScript. Styling is
plain CSS Modules, so there is nothing extra to configure.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Needs Node.js 20.9 or newer.

## What to edit first

| File | What it holds |
| --- | --- |
| `src/lib/site.ts` | Announcement bar, delivery / payment / exchange text, WhatsApp number, email, social links |
| `src/lib/catalog.ts` | iPhone models, collections, products, prices, colours |
| `src/components/Materials.tsx` | The four "what you get" claims |
| `src/app/globals.css` | Brand colours, type sizes, spacing |

Everything in `site.ts`, `catalog.ts` and `Materials.tsx` is sample
content. Check it against the real business before launch.

## Using real product photos

The cases on the page are drawn in code by `src/components/CaseArt.tsx`,
so the page looks finished before any photography exists.

To show a photo on a product card, put the file in `public/products/`
and add `image: "/products/your-file.jpg"` to that product in
`catalog.ts`. A 4:5 portrait photo fits the card.

## What is on the page

1. Announcement bar and sticky header (logo, navigation, search, cart count)
2. Hero: pick an iPhone and a finish, the case redraws, add it to the cart
3. Shop by material: four collection tiles
4. New in the line: eight product cards with colour swatches and an Add button
5. What you get in every case
6. Delivery, payment, exchange and WhatsApp help
7. Footer

## Not built yet

The links go to pages that do not exist yet: `/shop`, `/shop/[model]`,
`/collections/[id]`, `/products/[id]`, `/cart`, `/search`, `/help`,
`/contact`, `/track`, `/privacy`, `/terms`. Until they are added they
show the "We can't find that page" screen in `src/app/not-found.tsx`.

The cart lives in memory (`src/components/CartProvider.tsx`) and resets
on refresh. Replace its state with your real cart when the backend is
ready.


