# CareerOS Design Tokens

Design tokens are the atomic values that construct the CareerOS visual identity. They ensure absolute consistency across every component.

## 1. Color Palette (Dark Mode First)

CareerOS uses a sophisticated dark mode by default, leaning on deep Zinc/Slate tones for backgrounds to reduce eye strain, with highly vibrant accents for primary actions and AI interactions.

**Base (Backgrounds & Surfaces)**
- `bg-base`: `#09090B` (Deepest background, used for the app canvas)
- `bg-surface`: `#18181B` (Slightly elevated, used for cards and sidebars)
- `bg-surface-hover`: `#27272A` (For hovered rows and buttons)

**Borders**
- `border-subtle`: `#27272A` (Used for dividing rows and card outlines)
- `border-strong`: `#3F3F46` (Used for focused inputs or active states)

**Text**
- `text-primary`: `#FAFAFA` (High contrast, headers, active text)
- `text-secondary`: `#A1A1AA` (Muted, descriptions, placeholders)
- `text-tertiary`: `#71717A` (Disabled states, highly muted metadata)

**Brand & Accents**
- `brand-primary`: `#FAFAFA` (We use a high-contrast white for primary buttons to look extremely premium, inverse to the dark background)
- `brand-inverted`: `#09090B` (Used for text on primary buttons)
- `ai-primary`: `#6366F1` (Electric Indigo - used strictly for AI-generated insights, scores, and AI actions)
- `ai-secondary`: `#8B5CF6` (Violet - used in gradients with Indigo for AI borders/glows)

**Semantic (Status)**
- `status-success`: `#10B981` (Emerald)
- `status-warning`: `#F59E0B` (Amber)
- `status-error`: `#EF4444` (Red)
- `status-info`: `#3B82F6` (Blue)

## 2. Typography Scale

We use a modern, highly legible sans-serif stack (e.g., `Inter`, `Geist`, or system-ui).

- `text-xs`: 12px, line-height 16px (Badges, metadata)
- `text-sm`: 14px, line-height 20px (Body text, table rows, button labels)
- `text-base`: 16px, line-height 24px (Large body, primary inputs)
- `text-lg`: 18px, line-height 28px (Card titles, subheaders)
- `text-xl`: 20px, line-height 28px (Section headers)
- `text-2xl`: 24px, line-height 32px (Page titles)
- `text-3xl`: 30px, line-height 36px (Hero stats)
- `text-4xl`: 36px, line-height 40px (Massive hero numbers)

*Font Weights:* Regular (400) for body, Medium (500) for buttons/labels, Semibold (600) for card titles, Bold (700)/Black (900) for massive stats.

## 3. Spacing System

Based on a 4px grid.

- `space-1`: 4px
- `space-2`: 8px (Inner padding of small buttons)
- `space-3`: 12px (Padding of standard buttons/inputs)
- `space-4`: 16px (Standard gap between elements)
- `space-6`: 24px (Card padding)
- `space-8`: 32px (Section gaps)
- `space-12`: 48px (Major page divisions)

## 4. Border Radius

- `rounded-sm`: 4px (Checkboxes, small tags)
- `rounded-md`: 6px (Standard inputs, buttons)
- `rounded-lg`: 8px (Dropdowns, popovers)
- `rounded-xl`: 12px (Standard cards)
- `rounded-2xl`: 16px (Large dashboard widgets)
- `rounded-3xl`: 24px (Hero widgets, modals)
- `rounded-full`: 9999px (Avatars, pills)

## 5. Elevation & Shadows (Dark Mode)

In dark mode, shadows are less visible, so we rely on border highlights and subtle ambient glows.

- `shadow-sm`: Used for buttons. Drop shadow is barely visible; relies on a 1px top inner border highlight (`rgba(255,255,255,0.1)`).
- `shadow-md`: Used for cards. 
- `shadow-lg`: Used for dropdowns and popovers. Combines a dark shadow with a `1px solid var(--border-subtle)` to define the edge.
- `shadow-modal`: A massive, diffused shadow (`0 25px 50px -12px rgba(0, 0, 0, 1)`) combined with a backdrop blur on the overlay.
- `ai-glow`: `0 0 40px -10px rgba(99, 102, 241, 0.3)` (Used behind AI insight cards).
