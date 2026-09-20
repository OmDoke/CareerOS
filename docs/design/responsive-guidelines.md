# CareerOS Responsive Guidelines

Enterprise SaaS applications are predominantly used on desktop, but they must degrade gracefully to mobile without breaking workflows.

## 1. Breakpoints (Tailwind Defaults)
- `sm`: 640px (Large phones)
- `md`: 768px (Tablets)
- `lg`: 1024px (Laptops)
- `xl`: 1280px (Desktops)
- `2xl`: 1536px (Ultra-wide monitors)

## 2. Navigation Shifting

**Desktop (>= 1024px):**
- Permanent left sidebar.
- Full topbar.

**Tablet (768px - 1023px):**
- Sidebar collapses to an icon-only rail (64px wide). Text labels disappear.
- Hovering over an icon shows a tooltip.

**Mobile (< 768px):**
- Sidebar disappears entirely.
- A **Bottom Navigation Bar** appears, sticky to the bottom of the screen, holding 4-5 core routes (Dashboard, Jobs, Study, Profile).
- Complex routes (Settings, Admin) are accessed via a hamburger menu in the Topbar that opens a full-screen mobile menu.

## 3. Data Tables on Mobile
Data tables (like Job Tracker) break on mobile screens. We use the **Card Stacking** pattern:
- On `>= md`, render a standard `<table>`.
- On `< md`, hide the table headers and render each row as a `<Card>`. E.g., The "Company Name" becomes the card title, and "Status" becomes a badge inside the card.

## 4. Modals and Drawers
- **Desktop:** Modals are centered. Drawers slide in from the right.
- **Mobile:** Both Modals and Drawers transform into **Bottom Sheets** that slide up from the bottom of the screen, or they take up the entire full-screen viewport to maximize tap targets.

## 5. Touch Targets
- Any clickable element on mobile must have a minimum height/width of `44px` (Apple HIG standard). Ensure buttons have sufficient padding (`py-3`) on mobile views.
