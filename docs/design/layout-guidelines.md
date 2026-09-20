# CareerOS Layout Guidelines

This document outlines the macro-level layout structures and how different navigation elements interact within CareerOS.

## 1. The Sidebar Navigation

**Structure:**
- **Top:** Application Logo & User Workspace switcher.
- **Middle (Main Nav):** Links to Dashboard, Job Tracker, Resume, Study Plan.
- **Bottom:** Settings, Profile, Logout.

**Interaction:**
- Active links receive a distinct background `bg-surface-hover` and a solid left border (`border-l-2 border-primary`).
- Inactive links are `text-secondary` but turn `text-primary` on hover.

**Responsiveness:**
- **Desktop:** Fixed width (240px).
- **Tablet:** Collapses to an icon-only sidebar (64px).
- **Mobile:** Disappears entirely, replaced by a bottom navigation bar for core pages and a hamburger menu for secondary pages.

## 2. The Topbar

**Structure:**
- **Left:** Breadcrumbs reflecting the current routing depth (e.g., `Job Tracker / Apple / Application Details`).
- **Center/Right:** A search input that acts as a trigger for the Command Palette (`Cmd+K`).
- **Far Right:** Notification Bell (with a red dot indicator if unread) and the User Avatar.

**Behavior:**
- The topbar is always sticky.
- It uses a heavy backdrop blur (`backdrop-blur-md`) so content scrolls gracefully underneath it, creating a deep sense of layers.

## 3. Drawers vs. Modals

**When to use a Drawer (Slide-over):**
- When editing or viewing details of an item in a list (e.g., clicking a specific Job Application from a table).
- Drawers preserve the user's context, allowing them to quickly close it and select the next item.

**When to use a Modal (Dialog):**
- For distinct, interruptive actions that require the user's full focus (e.g., "Confirm Deletion", "Generate New Resume").
- Modals should be centered on the screen and dim the entire application behind them.

## 4. Page Headers

Every major page must have a standard header area beneath the topbar.
- **Title:** `text-2xl font-bold text-primary`.
- **Description:** `text-sm text-secondary` explaining the page's purpose.
- **Primary Action (Top Right):** The main CTA for the page (e.g., "Add New Job").

## 5. Forms Layout

- **Width:** Forms should generally be constrained to a max-width (e.g., `max-w-2xl`) to prevent input fields from spanning entire ultra-wide monitors, which ruins readability.
- **Alignment:** Labels should be positioned above inputs (not left-aligned) to accommodate varying translation lengths and improve vertical scanning.
- **Buttons:** Form submission buttons align to the right side of the form container.
