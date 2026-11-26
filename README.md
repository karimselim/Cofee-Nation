# Coffee Nation

A coffee shop storefront built with React and TypeScript. Browse coffee, iced drinks and meals, open a product, add it to a cart and see the order total.

Live site: https://cofee-nation.vercel.app

## Features

- Product catalogue with three categories and pagination (38 items, local data and images, no external API)
- Product detail pages at `/products/:category/:id`
- Shopping cart with quantity controls, tax and shipping lines, saved in the browser between visits
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
```

## How it was checked

Production build served locally and opened in Chrome at 1440x900 and 390x844. Every route loads with no console errors or failed requests, the cart flow (add, change quantity, remove, reload) works, and pagination moves between pages.

## Notes

- Prices in the data file are in thousands of IDR.
- The Firebase web config in the repo is a public client config, not a secret.
