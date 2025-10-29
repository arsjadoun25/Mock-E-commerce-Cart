# Mock E‑Com Cart — Vibe Commerce

A compact full‑stack shopping cart demo built for quick evaluation and a short recorded walkthrough.

## Technologies
- Frontend: React + Vite  
- Backend: Node.js + Express  
- Persistence: Prisma + SQLite  
- Dev tooling: nodemon (backend), Vite (frontend)

## Status
- Core flows implemented: products listing, add/update/remove cart items, mock checkout (creates receipts), receipts page.  
- UX improvements: toasts, loading indicators, cart badge, empty states, checkout modal with client & server validation.  
- Visual polish: pastel/neon palette, dark mode toggle, layered background, aspect-ratio image handling.

## Quick links
- Frontend dev server: http://localhost:5173  
- Backend API: http://localhost:4000/api

## Repository layout (high level)
- `backend/`
  - `src/index.js` — server entry (routes mounted here)
  - `src/routes/` — routes (products, cart, checkout, receipts)
  - `prisma/seed.js` — DB seed script (creates demo products)
  - `package.json` — backend scripts (`npm run dev`)
- `frontend/`
  - `public/` — static files (public images served by Vite)
  - `src/`
    - `main.jsx` — app entry (wraps ToastProvider)
    - `App.jsx` — header + navigation + theme toggle
    - `api.js` — simple fetch wrappers for `/api` endpoints
    - `components/` — Toast, ProductCard, CheckoutModal, etc.
    - `pages/` — ProductsPage, CartPage, ReceiptsPage
  - `package.json` — frontend scripts (`npm run dev`)

## Prerequisites
- Node.js  
- npm  
- Git

## Local setup (full)

1. Clone
```bash
git clone https://github.com/arsjadoun25/Mock-E-commerce-Cart.git
cd Mock-E-commerce-Cart
```

2. Backend
```bash
cd backend
# if present
cp .env.example .env
npm install
npx prisma generate

# (optional) apply migrations if you maintain them
# npx prisma migrate dev --name init

# Seed demo data:
node prisma/seed.js

# Start backend in dev mode
npm run dev
# Backend default: http://localhost:4000
```

3. Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend default: http://localhost:5173
```

## Images
- The `ProductCard` component includes an `onError` fallback (inline SVG) to avoid broken icons when images are missing.

## API (frontend-consumed)
- `GET /api/products` — list products (id, name, price, image)  
- `GET /api/cart` — current cart (items + total)  
- `POST /api/cart` — `{ productId, qty }` — add or update item  
- `DELETE /api/cart/:id` — remove cart item by cartItem id  
- `POST /api/checkout` — `{ name, email }` — validate, create receipt, clear cart  
- `GET /api/receipts` — list receipts

## Dev notes & behavior
- `ToastProvider` wraps the app so components can call `useToast()` to show transient notifications.  
- Cart operations show loading spinners and disable controls while requests are in-flight.  
- Checkout modal performs client-side validation and surfaces server errors when they occur.  
- Dark mode toggle stores choice in `localStorage` and uses the `data-theme` attribute for CSS overrides.

## Seeding
- `backend/prisma/seed.js` seeds example products (update image paths if you added local images).  
- Re-run seed after changing product images:
```bash
cd backend
node prisma/seed.js
```

### Screenshots
![Cart Item Added](https://raw.githubusercontent.com/arsjadoun25/Mock-E-commerce-Cart/main/screenshots/Cart%20Item%20Added.png)
![Cart](https://raw.githubusercontent.com/arsjadoun25/Mock-E-commerce-Cart/main/screenshots/Cart.png)
![Checkout Summary](https://raw.githubusercontent.com/arsjadoun25/Mock-E-commerce-Cart/main/screenshots/Checkout%20Summary.png)
![Receipt](https://raw.githubusercontent.com/arsjadoun25/Mock-E-commerce-Cart/main/screenshots/Receipt.png)


### Demo video (hosted externally)
Watch the demo on YouTube: https://youtu.be/tF-lOmVmTMg

## Contact
Built by `arsjadoun25`

Enjoy the demo!