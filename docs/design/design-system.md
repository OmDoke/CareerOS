# CareerOS Design System

This document explains how the foundational tokens combine into larger structural systems and grids for CareerOS.

## 1. The Grid System

CareerOS uses a standard 12-column responsive grid, but heavily relies on **CSS Grid** with specific `minmax` configurations for dashboard widgets (the "Bento Box" pattern).

### Dashboard Bento Grid
- **Desktop (>=1024px):** 4 columns (`grid-cols-4`). Gap: 24px (`gap-6`).
- **Tablet (768px - 1023px):** 2 columns (`grid-cols-2`). Gap: 16px (`gap-4`).
- **Mobile (<768px):** 1 column (`grid-cols-1`). Gap: 16px (`gap-4`).
- **Row Sizing:** Use `auto-rows-[minmax(180px,auto)]` to ensure a consistent minimum height for widgets while allowing them to expand if content dictates.

### Standard Page Grid
For standard pages (e.g., Job Tracker, Settings):
- **Max-Width:** The main content area should be constrained to `max-w-6xl` (approx 1152px) and centered to maintain readability on ultra-wide monitors.
- **Padding:** `px-4 md:px-8` on the main container.

## 2. Structural Layout Hierarchy

### The Canvas
The absolute base of the application.
- **Color:** `bg-base` (`#09090B`).
- **Scrollbar:** Hidden or highly minimized, custom styled scrollbars (e.g., `w-2`, transparent track, `#3F3F46` thumb).

### The Sidebar (Left Navigation)
- **Width:** 240px (Fixed).
- **Behavior:** Sticky to the left. On mobile, it collapses into a bottom navigation bar or a hamburger drawer.
- **Visuals:** `bg-surface` (`#18181B`) with a right border `1px solid var(--border-subtle)`.

### The Topbar
- **Height:** 64px (Fixed).
- **Behavior:** Sticky to the top. Contains Breadcrumbs, Global Search (`Cmd+K`), and User Profile.
- **Visuals:** `bg-base` with a high degree of transparency and a backdrop blur (Glassmorphism). Bottom border `1px solid var(--border-subtle)`.

### The Main Content Area
- Occupies the remaining width `calc(100vw - 240px)`.
- Handles its own vertical scrolling independent of the sidebar.

## 3. Z-Index Management

To prevent overlapping disasters, adhere to this strict z-index scale:

- `z-0`: Base content, backgrounds.
- `z-10`: Standard positioned elements (cards, relative elements).
- `z-20`: Sticky headers, topbars.
- `z-30`: Dropdowns, popovers, tooltips.
- `z-40`: Fixed overlays (backdrop blurs).
- `z-50`: Modals, Dialogs, Drawers.
- `z-100`: Toasts, Notifications (Must always be on top).

## 4. Glassmorphism & Blurs

Premium SaaS applications use blurs strategically to establish depth without heavy shadows.

- **Modals/Drawers Backdrop:** `bg-black/80 backdrop-blur-sm`.
- **Sticky Headers:** `bg-base/80 backdrop-blur-md`.
- **AI Glowing Orbs:** For AI features, place a `div` behind the content with `bg-ai-primary/20 blur-[80px]` to create a magical, ambient glow that doesn't interfere with text readability.

## 5. Micro-Interactions

- **Hover States:** Buttons and interactive cards should transition smoothly (`transition-all duration-200`). Cards should elevate slightly (`hover:-translate-y-0.5`) or scale (`hover:scale-[1.01]`).
- **Active (Click) States:** Buttons should scale down (`active:scale-95`) to provide immediate physical feedback.
