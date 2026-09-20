# CareerOS Accessibility (a11y) Guidelines

An AI-driven career platform must be accessible to all users, regardless of ability. We adhere to WCAG 2.1 AA standards.

## 1. Keyboard Navigation
- The entire application must be navigable without a mouse.
- **Focus States:** Every interactive element (links, buttons, inputs) must have a highly visible focus ring (`focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base`). Never use `outline-none` without providing a custom focus state.
- **Skip Links:** Include a visually hidden "Skip to main content" link at the very top of the DOM that becomes visible on focus.

## 2. ARIA Roles & Attributes
- **Modals/Drawers:** Must trap focus inside them while open (`aria-modal="true"`, `role="dialog"`). When closed, focus must return to the button that opened them.
- **State Updates:** When AI generates content or a job status changes, use `aria-live="polite"` regions to announce the update to screen readers without interrupting them.
- **Icon Buttons:** Any button that uses only an icon (e.g., a Trash can) must have an `aria-label` explaining its function (e.g., `aria-label="Delete Application"`).

## 3. Color Contrast
- CareerOS relies heavily on Dark Mode. Ensure all text against the `bg-base` or `bg-surface` meets the 4.5:1 contrast ratio.
- Do not rely solely on color to convey meaning. For example, an Error state should not just be a red border; it must also include a warning icon or explicit text (e.g., "Error: Email is required").

## 4. Forms and Validation
- Every input must be explicitly linked to a `<label>` using the `htmlFor` and `id` attributes.
- Required fields must be clearly marked.
- Error messages must be linked to the input via `aria-describedby` so screen readers announce the error when the input is focused.

## 5. Reduced Motion
- Honor the user's OS-level reduced motion preferences.
- Use CSS media queries (`@media (prefers-reduced-motion: reduce)`) to disable heavy animations, sliding drawers, and pulsing AI glows. Instead, use instant transitions or simple cross-fades.
