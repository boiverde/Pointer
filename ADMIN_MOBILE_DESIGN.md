# Admin Mobile-First App Design

## 1. Design Philosophy
The goal is **"Store Management in Your Pocket"**. The interface is optimized for speed and touch interactions, assuming the owner is managing the store on the go (e.g., checking stock in the warehouse).

## 2. Core Screens & Navigation

### A. Dashboard (Home)
*   **Hero**: Main Revenue Card (Today/Week) with a mini trendline.
*   **Quick Actions**: "Add Product", "Scan Barcode" (future), "Pending Orders (3)".
*   **Alerts**: Red banner for "5 items low on stock".

### B. Catalog (Products)
*   **Layout**: List view with thumbnail, name, and "Total Stock" badge.
*   **Filter/Search**: Bottom sheet filter (Team, Brand) + Sticky search bar.
*   **Detail View**: 
    *   Image Carousel.
    *   **Stock Grid (The Killer Feature)**: A matrix of sizes (S, M, L) with +/- buttons for instant adjustments. No deep menus.

### C. Orders
*   **List**: Cards showing ID, Customer, Status (Color-coded), and Time.
*   **Swipe Actions**: Swipe Right to "Mark Shipped". Swipe Left to "Cancel".
*   **Detail**: shows items, shipping address, and tracking number input.

### D. Analytics
*   **Tabs**: Sales | Inventory | Trends.
*   **Viz**: Simplified charts (Donut for sizes, Bar for teams). Focus on list rankings ("Top 5").

---

## 3. User Flows

### Flow 1: Restocking a Jersey (Speed)
1.  Open App -> Tap "Catalog".
2.  Search "Bra" -> Tap "Brazil Home".
3.  Scroll to "Stock Grid".
4.  User sees: `S: 2`, `M: 0`, `L: 5`.
5.  Tap `+` on `M` five times.
6.  **Auto-Save** triggers after 500ms debounce. (Feedback: Green checkmark appears).

### Flow 2: Process Order (Efficiency)
1.  Notification pops up: "New Order #123".
2.  Tap notification -> Order Detail.
3.  Review items.
4.  Tap "Mark as Shipped".
5.  Input tracking (or scan label).
6.  Status updates to `SHIPPED`.

---

## 4. UI/UX Suggestions for Mobile

| Component | Suggestion |
| :--- | :--- |
| **Navigation** | Bottom Tab Bar (Dashboard, Orders, Catalog, Menu). Thumb-friendly. |
| **Inputs** | Use Steppers (`- 1 +`) for stock instead of typing numbers. |
| **Feedback** | Haptic feedback (vibration) on successful stock update. |
| **Loading** | Skeleton screens instead of spinners for perceived speed. |
| **Dark Mode** | Essential for warehouse environments or night checks. |

---

## 5. Technology Considerations
*   **PWA (Progressive Web App)**: Since we are using Next.js for `apps/admin`, we can make it installable.
*   **Touch Targets**: Minimum 44x44px for all buttons.
*   **Viewports**: Test primarily on iPhone/Android sizes in DevTools.

