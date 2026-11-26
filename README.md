# Coffee Nation

A coffee shop storefront built with React and TypeScript. Browse coffee, iced drinks and meals, open a product, add it to a cart and see the order total.

Live site: https://cofee-nation.vercel.app

## Features

- Product catalogue with three categories and pagination (38 items, local data and images, no external API)
- Product detail pages at `/products/:category/:id`
- Prices in Egyptian pounds (EGP)
- Shopping cart with quantity controls, tax and shipping lines, saved in the browser between visits
- Demo checkout: needs an address and a payment method, then shows an order confirmation (no real payment is taken)
- Email/password and Google sign-in with Firebase Auth, protected History page
- Clear 404 page for unknown routes and a separate message for unknown products
- Responsive layout (checked at 390px and 1440px wide)

## Stack

React 18, TypeScript, React Router 6, Redux Toolkit, Firebase Auth, Tailwind CSS (Create React App).

## Run it

```bash
npm install
npm start        # http://localhost:3000
npm run build    # production build
npx tsc --noEmit # type check
npm run test:e2e # Playwright tests (builds and serves the app first)
```

## Tests

37 Playwright tests in `e2e/` cover navigation and 404s, product pages and pagination, cart (add, merge, quantity, remove, reload), checkout validation and order confirmation, auth pages, and mobile layout. They run in GitHub Actions on every push (`.github/workflows/e2e.yml`).

Locally, set `PW_CHROME_PATH` to use an installed Chrome, or run `npx playwright install chromium` once.

## Notes

- Prices in the data file are whole EGP.
- The Firebase web config in the repo is a public client config, not a secret.
