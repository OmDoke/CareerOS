# CareerOS Component Library

This library defines the reusable UI components for CareerOS, synthesizing the best interaction patterns from top-tier enterprise SaaS.

## 1. Buttons

**Purpose:** Trigger actions.
**Variants:**
- `Primary`: High contrast (`bg-white text-black` in dark mode). Used strictly for the single most important action on a page.
- `Secondary`: `bg-surface border-subtle`. Used for alternative actions.
- `Ghost`: Transparent background, hover state adds a subtle `bg-white/5`. Used for tertiary actions (e.g., "Cancel").
- `AI Action`: `bg-ai-primary`. Used exclusively when triggering an AI generation (e.g., "Generate Roadmap").
**States:** Default, Hover (`scale-105`), Active (`scale-95`), Disabled (`opacity-50 cursor-not-allowed`), Loading (replaces icon with a spinner, retains width).

## 2. Inputs & Textareas

**Purpose:** Collect user data.
**Variants:**
- `Standard`: `bg-surface border-subtle`. Focus state adds `ring-2 ring-primary`.
- `AI Enhanced`: Input field with an embedded AI sparkle icon that can auto-complete or format the text.
**Accessibility:** Always pair with a `<label>`. Use `aria-describedby` for error messages.
**Error State:** Border becomes `border-status-error`. Error text appears below in `text-status-error text-xs`.

## 3. Cards & Stat Cards

**Purpose:** Group related information into distinct modules.
**Variants:**
- `Standard Card`: `bg-surface rounded-xl border-subtle`.
- `Stat Card`: Minimalist. Title in `text-xs uppercase text-secondary`. Value in `text-4xl font-black`.
- `Bento Card`: Used on dashboards. Includes a subtle gradient `from-card to-card/50` and `backdrop-blur`.

## 4. Tables & Data Grids

**Purpose:** Display large collections of data (e.g., Job Applications).
**Interactions:**
- **Row Hover:** `bg-surface-hover`.
- **Actions:** Hidden by default, reveal a `...` menu on row hover to keep the interface clean.
- **Sticky Headers:** Always use sticky headers for long tables.
**Empty State:** An illustration in the center of the table area with a "Create First Entry" button.

## 5. Command Palette

**Purpose:** Global search and navigation (`Cmd+K`).
**Behavior:**
- Opens a modal dead center. 
- Blurs the background heavily.
- Filters instantly as the user types.
- Supports keyboard navigation (Up/Down arrows, Enter to select).

## 6. Drawers (Slide-overs)

**Purpose:** Display detailed information (e.g., Application Details) without losing context of the main list.
**Behavior:**
- Slides in from the right edge of the screen.
- Takes up 30-40% of the screen width on desktop, 100% on mobile.
- Closes via `Escape` key, clicking the backdrop, or the top-right `X` button.

## 7. AI Sparkle / Loading Skeleton

**Skeleton State:**
- Replaces content with a pulsing `bg-surface-hover` rounded rectangle.
- Always mirrors the exact dimensions of the content it replaces.

**AI Processing State:**
- A shimmering gradient sweeps across the skeleton.
- Dynamic text updates ("Reading...", "Synthesizing...") keep the user engaged.

## 8. Toast Notifications

**Purpose:** Non-blocking feedback for asynchronous actions.
**Behavior:**
- Slides in from bottom-right.
- Success (Green icon), Error (Red icon), Info (Blue icon).
- Auto-dismisses after 4000ms. Pause timer on hover.
