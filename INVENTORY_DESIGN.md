# Inventory Management System Design - Football Jersey Store

## 1. Core Concept: Variant-Level Control
Inventory is NOT managed at the "Product" level (e.g., "Arsenal Home Kit") but at the **Variant** level (e.g., "Arsenal Home Kit - Size M"). This is crucial for apparel.

*   **Database Entity**: `ProductVariant`
    *   `id`: UUID
    *   `productId`: Reference to main product
    *   `size`: 'S', 'M', 'L', 'XL'
    *   `stock`: Integer (Current Quantity)
    *   `sku`: String (Unique Stock Keeping Unit)

---

## 2. Logic Flow: The "Safe Sale" Process

### Step 1: Pre-Checkout Validation (Cart View)
*   **Action**: User views cart.
*   **Check**: Query `stock` for each item in cart.
*   **Result**: If `stock < requested_qty`, show "Only X left" or "Out of Stock" warning. Disable checkout button if 0.

### Step 2: Transactional Order Creation (The Critical Moment)
*   **Action**: User clicks "Pay".
*   **System**: Initiates a **Database Transaction**.
    1.  **Lock Rows**: Select specific `ProductVariant` rows `FOR UPDATE`.
    2.  **Verify**: Check condition `stock >= requested_quantity`.
    3.  **Reject**: If condition fails, ROLLBACK transaction and return error "Size X just sold out".
    4.  **Update**: If pass, `UPDATE ProductVariant SET stock = stock - quantity`.
    5.  **Log**: Insert record into `StockMovement` (audit trail).
    6.  **Order**: specific `Order` and `OrderItem` records created.
    7.  **Commit**: Finalize transaction.

---

## 3. Stock History & Audit Trail
We do not rely solely on the current `stock` number. Every change is recorded in a `StockMovement` ledger.

### New Table: `StockMovement`
*   `id`
*   `variantId`
*   `type`: enum ('SALE', 'RESTOCK', 'RETURN', 'ADJUSTMENT')
*   `quantity`: int (negative for sales, positive for restock)
*   `reason`: string ("Order #123", "Q3 Restock", "Damaged Item")
*   `createdAt`: timestamp

**Benefit**: allows reconstructing inventory at any point in time and identifying shrinkage/theft.

---

## 4. Low Stock Alerts
The system runs a periodic check (or checks after every sale) to trigger alerts.

*   **Threshold**: Configurable per SKU or global (e.g., < 5 units).
*   **Action**:
    *   **Admin Dashboard**: "Low Stock" widget shows variants below threshold.
    *   **Logic**: `SELECT * FROM ProductVariant WHERE stock <= 5`.

---

## 5. Edge Cases Handling

| Scenario | Solution |
| :--- | :--- |
| **Race Condition** (2 users buy last item at exact same ms) | **Row Locking**. The DB handles this. First user locks the row, updates it. Second user reads the *new* value (0), transaction fails. |
| **Payment Failure** | Order is created *pending* payment. If payment webhook returns "Failed", a "Release Stock" (Adjustment) transaction runs RESTORING the stock. |
| **Cart Hoarding** | Stock is *not* reserved on "Add to Cart". It is only reserved/deducted on confirmed Order. (Optional: Temporary reservation for 10mins during checkout flow, complex but improved UX). |
| **Returns** | When an order is marked "Returned", a system routine increments stock and logs a 'RETURN' movement. |

---

## 6. Suggested Database Queries

### Check Stock (Optimistic)
```sql
SELECT stock FROM "ProductVariant" WHERE id = 'variant_123';
```

### Decrease Stock (Transactional)
```sql
UPDATE "ProductVariant" 
SET stock = stock - 2 
WHERE id = 'variant_123' AND stock >= 2;
-- Check rowCount. If 0, update failed (out of stock).
```

### Get Low Stock Alerts
```sql
SELECT p.name, v.size, v.stock 
FROM "ProductVariant" v
JOIN "Product" p ON v."productId" = p.id
WHERE v.stock < 5
ORDER BY v.stock ASC;
```

### View Stock History
```sql
SELECT * FROM "StockMovement" 
WHERE "variantId" = 'variant_123' 
ORDER BY "createdAt" DESC;
```
