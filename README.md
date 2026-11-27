# Coffee Nation

A coffee shop storefront built with React and TypeScript. Browse coffee, iced drinks and meals, open a product, add it to a cart and see the order total.

The goal is a realistic shop front end to build and to test: browsing, a cart that follows the rules (sizes, promo codes, tax), a checkout with validation and per-account data, without needing a backend.

Live site: https://cofee-nation.vercel.app

## Features

- Product catalogue with three categories and pagination (38 items, local data and images, no external API)
- Product detail pages at `/products/:category/:id`
- Prices in Egyptian pounds (EGP)
- Shopping cart with quantity controls, tax and shipping lines, saved in the browser between visits
- Demo checkout: needs an address and a payment method, then shows an order confirmation (no real payment is taken)
- Email/password and Google sign-in with Firebase Auth. New accounts must verify their email before they can log in; error messages say what is wrong; eye icon on password fields
- Protected History (paid orders), Messages (notifications) and Favourites pages; cart, orders, messages and favourites are saved per account in the browser (no backend, so they do not sync across devices)
- Sizes (Regular, Large, Extra large) change the price, and the price follows the quantity
- Search by name, max price filter and sort on the product pages
- Promo codes in the cart (WELCOME10, SAVE50, COFFEE20 with a minimum, expired and invalid codes are rejected, no stacking)
- Notification banner that slides in and out, and a custom sort dropdown
- The cart badge counts orders (cart lines), not units
- Clear 404 page for unknown routes and a separate message for unknown products
- Responsive layout (checked at 390px and 1440px wide)

## Stack

Versions from `package-lock.json`:

- React 18.2.0, TypeScript 4.9.5, React Router 6.4.5, Redux Toolkit 1.9.5
- Firebase 10.4.0 (Auth), Tailwind CSS 3.3.3
- Create React App (`react-scripts` 5.0.1)
- Playwright 1.65.1 for the end to end tests

## Requirements

Node.js and npm. CI uses Node 20, so use Node 20 or newer. No database or server is needed, all data is local.

## Environment variables

None are needed to run or build the app. The Firebase web config is in the repo (it is public client config). `REACT_APP_FAKE_AUTH=true` swaps Firebase for a local stand-in and is only used by the tests, which set it themselves. `PW_CHROME_PATH` is optional, see Tests.

## Run it

```bash
npm install
npm start        # http://localhost:3000
npm run build    # production build
npx tsc --noEmit # type check
npm run test:e2e # Playwright tests (builds and serves the app first)
```

## Tests

79 Playwright tests in `e2e/` cover navigation and 404s, products, search/filter/sort, sizes and prices, cart and checkout validation, promo codes, signup/login/verification errors, per-account carts and history, favourites, the cart badge, the notification animation, the sort dropdown and mobile layout. Tests build the app with `REACT_APP_FAKE_AUTH=true`, a local stand-in for Firebase, so signup and email verification can run without a real inbox. They run in GitHub Actions on every push (`.github/workflows/e2e.yml`).

Locally, set `PW_CHROME_PATH` to use an installed Chrome, or run `npx playwright install chromium` once.

## Notes

- Prices in the data file are whole EGP.
- The Firebase web config in the repo is a public client config, not a secret.
