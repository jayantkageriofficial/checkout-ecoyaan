# EcoShop Checkout — Next.js Assignment

A multi-step checkout flow built with **Next.js App Router**, **Tailwind CSS**, **Context API**, and **react-use**.

## Architecture

### Tech Stack

- **Next.js** (App Router) — SSR via async Server Components
- **TypeScript** — full type safety across the codebase
- **Tailwind CSS v4** — utility-first styling, responsive layout
- **Context API** — lightweight global state for cart + address data
- **react-use** — `useKey` hook for keyboard shortcut support in modals

### Project Structure

```text
src/
├── app/
│   ├── api/cart/route.ts          # Mock REST API returning cart JSON
│   ├── cart/
│   │   ├── page.tsx               # Server Component — fetches cart via SSR
│   │   └── CartClient.tsx         # Client Component — renders cart UI
│   ├── checkout/
│   │   ├── page.tsx               # Unified checkout (address + payment)
│   │   ├── shipping/page.tsx      # Redirects → /checkout
│   │   ├── payment/page.tsx       # Redirects → /checkout
│   │   └── success/page.tsx       # Order success screen (client)
│   ├── layout.tsx                 # Root layout with CheckoutProvider
│   └── page.tsx                   # Redirects / → /cart
├── components/
│   ├── AddressModal.tsx           # Add / edit a single address (form + validation)
│   ├── AddressListModal.tsx       # Select, add, edit, or remove saved addresses
│   ├── CartItemRow.tsx            # Single cart item display
│   ├── PriceSummary.tsx           # Subtotal / shipping / total breakdown
│   ├── Header.tsx                 # Sticky navigation header
│   └── StepIndicator.tsx          # 3-step progress bar
├── context/
│   └── CheckoutContext.tsx        # Cart data, saved addresses, selected address, payment method
└── types/
    └── index.ts                   # Shared TypeScript interfaces
```

### Design Decisions

**SSR Data Fetching** — The `/cart` page is an async Server Component that calls the internal `/api/cart` route with `cache: "no-store"` before rendering. This ensures cart data is always fresh and available on first paint without a client-side loading state.

**Multiple Saved Addresses** — The context stores a `savedAddresses` array alongside the currently selected `shippingAddress`. Users can add multiple addresses, switch between them, edit any entry, or remove one — all from a single `AddressListModal`. On confirmation, the chosen address is set as the active shipping address. Addresses with the same `id` in context are updated in both the saved list and the selected address automatically.

**Address Management Flow** — Clicking "Add Delivery Address" or "Change" on the checkout page opens `AddressListModal`, which acts as the entry point for all address actions. From there, users can open `AddressModal` to fill in a new address or edit an existing one. This keeps the form logic isolated in `AddressModal` while `AddressListModal` owns the selection and list management.

**Keyboard Shortcuts** — Both modals use `useKey` from `react-use` for accessibility:

- `Escape` — closes the modal
- `Enter` — submits the form (`AddressModal`) or confirms the selected address (`AddressListModal`)

Hooks are always called unconditionally before any early returns so they remain consistent across render cycles.

**Form Validation** — The address form uses controlled inputs with per-field blur validation and a full-validation pass on submit. Errors are only shown after a field is touched or a submit is attempted, avoiding premature error messages.

**Guard Clauses** — Each checkout page checks that required upstream state (cart data, shipping address) exists and redirects back to `/cart` if not, preventing broken mid-flow deep links.

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/cart`.

### Build for production

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel:

1. Import on [vercel.com/new](https://vercel.com/new)
2. Set `NEXT_PUBLIC_BASE_URL` to your Vercel deployment URL in project settings
3. Deploy

## Checkout Flow

```text
/ → /cart → /checkout → /checkout/success
```

1. **Cart** — SSR-rendered list of items with subtotal, shipping fee, and grand total
2. **Checkout** — Select or add a delivery address, choose payment method (Online / COD)
3. **Success** — Animated confirmation with order ID, transaction ID, and delivery details
