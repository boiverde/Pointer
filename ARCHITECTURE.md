# Football Jersey Store - System Architecture

## 1. High-Level Overview

The system is designed as a **Monorepo** using **Turborepo**, ensuring code sharing, type safety, and efficient development. It consists of three main applications and a shared database package.

### Components:
*   **Store (`apps/store`)**: Public-facing e-commerce application. Focus on SEO, Performance (SSR/ISR), and UX.
*   **Admin (`apps/admin`)**: Internal management dashboard. Focus on Data Management, Analytics, and Real-time updates.
*   **API (`apps/api`)**: Central Backend Service. Focus on Business Logic, Validation, and Database interactions.
*   **Database (`packages/database`)**: Shared ORM (Prisma) and Type Definitions.

---

## 2. Technology Stack

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Monorepo** | **Turborepo** | Efficient build system, shared dependencies/types. |
| **Frontend** | **Next.js 14+ (App Router)** | Best for SEO (Store) and easy routing (Admin). |
| **Styling** | **Tailwind CSS** | Rapid UI development, consistency via `globals.css`. |
| **Backend** | **NestJS** | Structured, scalable, TypeScript-first framework. |
| **Database** | **PostgreSQL** | Relational integrity for Orders/Stock. |
| **ORM** | **Prisma** | Type-safe database access, easy schema management. |
| **State** | **Zustand / React Query** | Client-side state and async data fetching. |
| **Payments** | **Stripe / Mercado Pago** | Secure payment processing. |

---

## 3. Data Models (Core)

Based on the requirements (Jerseys, Sizes, Teams), the database schema is structured as follows:

*   **Product**: The core entity (e.g., "Arsenal Home 24/25").
    *   Relations: `Team`, `Brand`, `Category` (League/Type).
*   **Variant**: Specific SKU for a product (e.g., "Arsenal Home - Size M").
    *   Attributes: `Size`, `Stock`, `SKU`.
*   **Team**: (e.g., "Brazil", "Real Madrid").
    *   Attributes: `Name`, `League`, `Logo`.
*   **Brand**: (e.g., "Nike", "Adidas").
*   **Order**: Records a sale.
    *   Relations: `User`, `OrderItem` (snapshots of Price/Variant).

---

## 4. Communication & Data Flow

### A. Communication Strategy
*   **Server-Side (Store/Admin -> API)**: HTTP REST Requests.
    *   *Alternative*: Direct DB access in Next.js Server Actions (simpler for small apps), but **NestJS API** was chosen for separation of concerns and complex logic handling (as requested).
*   **Client-Side (Browser -> API)**: Fetches for dynamic data (cart, stock checks).

### B. "Sale to Stock" Flow
1.  **User** selects Jersey + Size (Variant ID) and proceeds to checkout.
2.  **Store** sends `POST /checkout` to **API**.
3.  **API** validates Stock:
    *   `if (variant.stock < requestedQty) throw Error`.
4.  **Payment** is processed (Webhooks used for confirmation).
5.  **API** creates `Order` linked to `User`.
6.  **API** decrements `Variant.stock` transactionally.
7.  **Admin** dashboard updates via SWR/React Query polling or WebSockets (if implemented).
8.  **Store** pages revalidate (ISR) to show "Out of Stock" if needed.

---

## 5. Synchronization
*   **Shared Types**: The `packages/database` exports Prisma types, ensuring `Store`, `Admin`, and `API` all agree on what a "Product" looks like.
*   **Transactional Integrity**: All stock updates occur within Database Transactions to prevent overselling.

