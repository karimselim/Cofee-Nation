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

The Playwright suite uses the page-object layout from my Vendure project: page classes in `pages/`, API clients in `api-clients/`, fixtures that build them in `fixtures/`, types in `types/`, test data in `test-data/` and specs in `tests/ui` and `tests/api`.

```
pages/           one class per page (ProductsPage, ProductDetailsPage, CartPage, ...)
api-clients/     one class per REST area (ProductsApiClient, CartApiClient, OrdersApiClient, PromoApiClient)
fixtures/        Playwright fixtures that create the page objects and API clients
types/           types for page data and API responses
test-data/       products, checkout values and account data used by the tests
tests/ui/        browser tests (desktop and mobile projects)
tests/api/       REST API tests
api/             the REST endpoints (Vercel serverless functions)
server/          the same handlers on a local port, so the API tests run without Vercel
```

`api/` is a read-only shop API over the same product data the UI uses: `GET /api/products`, `GET /api/products/:slug`, `GET /api/categories`, `POST /api/cart/price`, `POST /api/promo/validate` and `POST /api/orders`. It mirrors the rules in `src/utils` (sizes, tax and shipping, promo codes, shop hours 09:00-22:00) so the API tests check the same behaviour the UI enforces.

Coverage:

- Catalog: list, category filter, search, max price, sorting, pagination, unknown category/sort, 404 for a missing product.
- Cart: line pricing, size multipliers, quantity, tax and shipping, promo discounts, bad quantities and unknown products.
- Checkout: empty cart, address required for delivery, delivery time inside and outside 09:00-22:00, invalid time format, missing payment method, long notes, order number.
- UI: home and navigation, mobile menu, search/filter/sort, pagination, product page totals, cart badge counting lines, promo codes, the delivery time field, order confirmation, signup and verification, login errors, protected routes, favourites, mobile layout.

Bugs the tests lock down: an out-of-hours delivery time was accepted, an invalid time such as 25:00 was accepted, the cart badge counted units instead of lines, the favourites page was left aligned, the sort and search row overlapped, a bad max price returned an unfiltered list, and an empty cart asked for a payment method instead of saying the cart is empty.

Tests build the app with `REACT_APP_FAKE_AUTH=true`, a local stand-in for Firebase, so signup and email verification can run without a real inbox. They run in GitHub Actions on every push (`.github/workflows/e2e.yml`).

```bash
npm run test:e2e    # every project (desktop, mobile, api, legacy)
npm run test:ui     # browser tests
npm run test:api    # REST API tests
npm run api:dev     # the REST API on http://localhost:3200/api
npm run test:types  # type check the test library
```

The older suite in `e2e/` still runs as the `legacy-desktop` and `legacy-mobile` projects until every case lives in the page objects above. Locally, set `PW_CHROME_PATH` to use an installed Chrome, or run `npx playwright install chromium` once.

## Notes

- Prices in the data file are whole EGP.
- The Firebase web config in the repo is a public client config, not a secret.
