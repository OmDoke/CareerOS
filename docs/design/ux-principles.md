# CareerOS UX Principles

CareerOS is an AI-powered career operating system. To serve ambitious professionals effectively, the interface must prioritize speed, clarity, and empowerment. 

These principles are synthesized from the absolute best enterprise SaaS platforms, emphasizing keyboard-first navigation, progressive disclosure, and deep focus.

## 1. Keyboard-First Navigation
The fastest way to navigate an interface is without leaving the keyboard.
- **Command Palette (`Cmd/Ctrl + K`):** Every significant action, page, or search query must be accessible via a global command palette.
- **Hotkeys:** Assign single-letter hotkeys for frequent actions (e.g., `C` to create a task, `/` to focus search, `[` to toggle the sidebar).
- **Focus Rings:** Provide highly visible, aesthetic focus rings (e.g., a solid 2px primary color ring with a slight offset) for all interactive elements.

## 2. Progressive Disclosure
CareerOS handles complex data (roadmaps, analytics, job applications). Avoid overwhelming the user.
- **Detail on Demand:** Use drawers and slide-overs to reveal secondary information instead of navigating away from the context or cluttering the primary view.
- **Bento Box Modularity:** Group related data into distinct, tight widgets. If a user needs more information, provide a clear "View All" or arrow icon to navigate to a dedicated detail page.

## 3. Immediate Feedback & State Awareness
Enterprise users hate waiting without knowing why.
- **Optimistic UI:** When a user updates a status (e.g., Job Application moved to "Interviewing"), update the UI instantly before the server confirms.
- **Skeleton Loading:** Never use a blank screen or a generic spinner for full-page loads or AI generations. Use skeleton screens that mirror the final layout to increase perceived speed.
- **Dynamic AI States:** When the AI is processing (e.g., analyzing a resume), cycle through dynamic loading text ("Extracting skills...", "Mapping to roles...") to build trust.

## 4. Density and Hierarchy
Balance information density with visual breathing room.
- **F-Pattern Layouts:** Place the most critical information (The "Next Best Action") at the top-left.
- **Subtle Borders & Elevation:** Use incredibly subtle borders (e.g., `1px solid var(--border-subtle)`) instead of heavy drop shadows to separate content. Use elevation (shadows) strictly for transient elements like modals, popovers, and dropdowns.

## 5. The "Empty State" is an Opportunity
An empty state should never just say "No data."
- **Actionable Onboarding:** Every empty state must explain *what* goes here, *why* it's valuable, and provide a primary CTA to create the first item.
- **Illustration:** Use subtle, beautiful vector illustrations to make the platform feel polished.

## 6. AI as a Co-Pilot, Not an Override
AI should augment the user's capabilities, not wrestle control from them.
- **Clear AI Provenance:** Any AI-generated insight, score, or text must have a distinct visual treatment (e.g., a subtle violet gradient or sparkle icon) so the user knows its origin.
- **Human in the Loop:** Always allow the user to edit, reject, or regenerate AI suggestions (e.g., editing the AI-extracted skills from a resume).
