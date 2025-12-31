# System Integration & Workflow

This document details how the three main components (`Store`, `Admin`, `API`) collaborate to form a cohesive system.

## 1. Authentication & Permissions

We use **JWT (JSON Web Tokens)** for stateless, secure authentication across apps.

### Roles
*   **Customer**: Can browse, create cart, place orders, view *own* history.
*   **Admin**: Can manage *all* products, stock, orders, and view analytics.

### Architecture
1.  **Login**: User posts credentials to `POST /auth/login`.
2.  **Token**: API validates and returns `access_token` containing `{ userId, role }`.
3.  **Client Strategy**:
    *   **Store**: Stores token in `HttpOnly Cookie` (secure against XSS).
    *   **Admin**: Stores token in `Secure Storage` or Cookie.
4.  **Guards (API)**:
    *   `@UseGuards(JwtAuthGuard)`: Verifies token validity.
    *   `@Roles('ADMIN')`: Checks if `role === 'ADMIN'`.

---

## 2. The "Full Flow": Purchase Lifecycle

Here is the step-by-step journey of a Jersey from shelf to customer.

### Phase 1: The Transaction
1.  **Discovery**: Customer views "Brazil Home 2024" on **Store**.
    *   *System*: Store fetches `GET /products/brazil-home` from **API**.
    *   *Data*: API joins `Product + ProductVariant` to show valid sizes/stock (e.g., "M: 5 left").
2.  **Checkout**: Customer adds "Size M" to cart and pays.
    *   *System*: Store sends `POST /checkout` with `{ variantId, qty, paymentToken }`.
3.  **Validation (The Gatekeeper)**:
    *   **API** opens a **Database Transaction**.
    *   Locks the `ProductVariant` row.
    *   Checks: `IF stock < qty THEN ROLLBACK & Error("OOS")`.
    *   Updates: `stock = stock - qty`.
    *   Creates: `Order` (Status: `PENDING`) and `StockMovement` (Type: `SALE`).
    *   **API** Commits Transaction.

### Phase 2: Post-Purchase Sync
4.  **Confirmation**: API returns success.
    *   *Store*: Shows "Thank you!" page.
    *   *Stock*: Database now reflects "M: 4 left".
5.  **Admin Update**:
    *   **Admin App** polls `GET /analytics/dashboard` (or receives WebSocket event).
    *   Dashboard updates "Total Revenue" and charts.
    *   If stock hit threshold (e.g., <5), "Low Stock Alert" triggers.

### Phase 3: Fulfillment
6.  **Processing**: Admin sees "Order #101 - Pending" in **Admin App**.
7.  **Action**: Admin packs jersey, generates label.
    *   Clicks "Mark as Shipped".
    *   *Request*: `PATCH /orders/101 { status: 'SHIPPED', tracking: 'BR123' }`.
8.  **Notification**: API sends email/notification to Customer.

---

## 3. Stock Synchronization Strategy

How do we ensure the Store doesn't show stock that doesn't exist?

1.  **Real-time Validation**: The Cart *always* re-checks stock immediately before payment. Front-end "Available" numbers are optimistic hints, not guarantees.
2.  **Optimistic UI (Admin)**: When Admin adds stock (`+10`), the app updates UI immediately while sending the API request. If API fails, it reverts (User sees toast: "Failed to update").
3.  **Shared Truth**: Both apps query the **same** database tables. There is no sync lag because there is no separate "Store DB" and "Admin DB".

---

## 4. Error Handling (The "Unhappy Paths")

| Scenario | Solution |
| :--- | :--- |
| **Race Condition** | Two users buy the last shirt at the precise same millisecond. **DB Row Locking** ensures only one transaction succeeds. The loser gets a friendly "Sorry, item just sold out" message. |
| **Payment Failure** | User's card is declined *after* stock was reserved. **System**: Webhook receives "Failed". Logic runs `STOCK_ADJUSTMENT` to return items to inventory (+1). |
| **API Down** | Store UI enters "Read-Only" mode (Browse ok, Checkout disabled) or relies on ISR (Cached pages) with disabled interactive elements. |

---

## 5. Analytics Update Logic
Analytics are **derived** from the source of truth (`Orders`). We do not store "Total Sales" as a separate mutable number that could get out of sync.
*   *Query*: "Calculate total sales today".
*   *Execution*: `SUM(total) FROM Order WHERE date = Today AND status = PAID`.
*   This ensures analytics are **always accurate** to the millisecond.
