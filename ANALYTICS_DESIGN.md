# Admin Analytics Dashboard Design

## 1. Overview
The Admin Dashboard is the command center for the store owner. It provides real-time insights into revenue, trends, and inventory health to support decision-making (e.g., "Time to restock Brazil kits" or "Launch a sale on small sizes").

## 2. Key Metrics & Data Logic

### A. Financial Performance
*   **Total Revenue**: Sum of all confirmed sales.
    *   *Logic*: `SUM(Order.total)` where `status = PAID`.
    *   *Viz*: Big Number Card (e.g., "R$ 45.200,00").
*   **Sales vs Period**: Revenue trends over time.
    *   *Logic*: Group Orders by `DATE(createdAt)`, sum total.
    *   *Viz*: **Line Chart** (X-axis: Date, Y-axis: Revenue).

### B. Product Performance ("The Best Sellers")
*   **Top Jerseys**: Which specific shirts are flying off the shelves?
    *   *Logic*: Join `OrderItem` -> `Variant` -> `Product`. Sum `quantity`. Order by DESC.
    *   *Viz*: **Horizontal Bar Chart** or Top 5 List.
*   **Top Teams**: Which club/country is most popular?
    *   *Logic*: Join `OrderItem` -> `Variant` -> `Product` -> `Team`. Group by `Team.name`.
    *   *Viz*: **Bar Chart** (e.g., Flamengo vs. Real Madrid).
*   **Top Brands**: Ranking manufacturers.
    *   *Logic*: Join `OrderItem` -> `Variant` -> `Product` -> `Brand`.
    *   *Viz*: **Pie Chart** (Share of sales).

### C. Inventory Insights ("The Size Grid")
*   **Best-Selling Sizes**: Understanding user demographics.
    *   *Logic*: Group `OrderItem` by `Variant.size` (S, M, L, XL).
    *   *Viz*: **Donut Chart**.
*   **Low Stock Alerts**: Critical actionable data.
    *   *Logic*: `SELECT * FROM ProductVariant WHERE stock < 5`.
    *   *Viz*: **Alert Table** (Red highlights) with "Restock" button.

---

## 3. Technical Implementation (Prisma Queries)

### Revenue Over Time (Example)
```typescript
// For a "Last 30 Days" chart
const revenue = await prisma.order.groupBy({
  by: ['createdAt'],
  where: { 
    status: 'PAID',
    createdAt: { gte: thirtyDaysAgo } 
  },
  _sum: { total: true },
});
// *Note*: In production, use distinct SQL raw query for proper date truncation (Day/Week).
```

### Top Teams
```typescript
const topTeams = await prisma.orderItem.groupBy({
  by: ['product.teamId'], // Requires extensive relation mapping or raw query in Prisma
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: 'desc' } },
  take: 5
});
```

---

## 4. Visualization Layout (Wireframe)

```
[ Header: Store Overview | Date Range Picker ]

[ Card: Total Sales ] [ Card: Orders Today ] [ Card: Avg Order Value ] [ Card: Low Stock Items ]

---------------------------------------------------------
|  [ Line Chart: Revenue History ]                      |
|  (Shows sales spike during game days)                 |
---------------------------------------------------------

---------------------------------------------------------
| [ Bar Chart: Top Teams ] |  [ Donut: Sizes Sold ]     |
| 1. Brazil                |  M (40%)                   |
| 2. Arsenal               |  L (30%)                   |
| 3. Flamengo              |  S (15%)                   |
---------------------------------------------------------

[ Table: Recently Sold ]
| Order # | Customer | Items           | Total  | Status |
|---------|----------|-----------------|--------|--------|
| #1024   | John D.  | Brazil Home (M) | R$ 129 | PAID   |
```
