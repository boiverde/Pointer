# Football Jersey Store - Development Roadmap

## Phase 1: The Core Foundation (MVP)
*Goal: Get a functional backend and database that can handle a sale.*

### 1.1 Model & Database (Done-ish)
- [x] Set up Monorepo (Turborepo).
- [x] Design Schema (Products, Variants, Orders, StockMovements).
- [x] Create Seed Script for initial data (Brazil, Arsenal kits).
- [ ] **Action**: Run migrations and seed the DB locally.

### 1.2 Backend API (NestJS) - Priority High
- [x] Basic Setup.
- [ ] **Auth Module**: Implement JWT Login/Register (Admin vs Customer).
- [ ] **Products API**: Handlers for CRUD operations (Create Jersey, Update Stock).
- [ ] **Cart & Order API**: The critical "Checkout Transaction" logic (Stock deduction).
- [ ] **Uploads**: Setup specific Cloudinary/S3 service for Jersey images.

---

## Phase 2: The Command Center (Admin App)
*Goal: Allow the business owner (you) to manage the inventory without touching code.*

### 2.1 Admin Auth & Layout
- [ ] Login Screen (consumes Auth API).
- [ ] Mobile-First Shell (Navigation, Responsive Layout).

### 2.2 Inventory Management (The "Daily Driver")
- [ ] **Product List**: View all jerseys with stock indicators.
- [ ] **Stock Grid**: Edit stock counts for S/M/L directly.
- [ ] **Add Product Form**: Upload images, set teams, define prices.

### 2.3 Order Processing
- [ ] **Order List**: See incoming sales.
- [ ] **Detail View**: Mark as Sent, add Tracking Number.

---

## Phase 3: The Public Store (Customer Facing)
*Goal: A beautiful, fast shopping experience.*

### 3.1 Storefront (Next.js)
- [ ] **Home**: Hero banner, "Featured" grid (Static -> Dynamic).
- [ ] **Catalog**: Filter by Team, League, Size.
- [ ] **Product Detail (PDP)**: High-quality image gallery, Size Selector (disabling OOS sizes).

### 3.2 Checkout Flow
- [ ] **Cart State**: Zustand store for local cart management.
- [ ] **Checkout Page**: Address form + Payment Integration (Stripe/Mercado Pago mock).
- [ ] **Success Page**: Order confirmation summary.

---

## Phase 4: Integration & Polish
*Goal: Smooth out the edges.*

### 4.1 Integration
- [ ] Connect Real API to Store Frontend (replace mocks).
- [ ] Implement SEO (Metadata, OpenGraph for sharing links).
- [ ] Configure ISR (Incremental Static Regeneration) for fast page loads.

### 4.2 Error Handling
- [ ] "Sold Out" handling during checkout race conditions.
- [ ] Empty States (No orders, specific size missing).

---

## Phase 5: Testing & Launch
*Goal: Production readiness.*

- [ ] **Load Test**: Simulate 50 users buying the same item.
- [ ] **Deployment**:
    - DB: Vercel / Railway / Supabase.
    - Apps: Vercel (Store & Admin).
    - API: Railway or Render (for persistent NestJS process).
- [ ] **Launch**: DNS setup, SSL verification.

---

## Phase 6: Future Improvements (Post-MVP)
- [ ] **Barcode Scanning**: Use phone camera in Admin App to find jerseys.
- [ ] **Wishlist**: Allow users to save items.
- [ ] **Reviews**: Star ratings for jerseys.
- [ ] **Automated Emails**: Resend/Grid integration for "Order Shipped".
