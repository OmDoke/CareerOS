# CareerOS Page Patterns

This document maps every core page in CareerOS to the proven UX patterns extracted from top-tier enterprise applications.

## 1. Dashboard (The Command Center)
**UX Pattern:** Bento-box Widget Grid (Vercel/Apple)
- **Why:** Dashboards shouldn't be vertical scrolls of endless charts. A bento-box forces strict prioritization. The user must see the *Next Action* immediately.
- **Hierarchy:** 
  - 2x2 Hero Widget (Today's Study Session).
  - 2x1 AI Career Coach (Daily insight).
  - 1x1 Quick Stats (Streaks, Scores).
- **Mobile:** The grid stacks cleanly into a single column.

## 2. Job Tracker
**UX Pattern:** Kanban Board / Robust Table (Linear/Jira)
- **Why:** Users need to visualize where applications are in the pipeline.
- **Hierarchy:** A toggle allows switching between a List View (Table) and a Board View (Kanban).
- **Interaction:** Drag-and-drop columns for Kanban. The Table view uses sticky headers and inline status edits (via a custom dropdown menu).

## 3. Application Details
**UX Pattern:** Drawer / Slide-over (Stripe/HubSpot)
- **Why:** When clicking a job from the tracker, navigating to a new page breaks flow. A drawer sliding in from the right allows the user to see details, add notes, and close it instantly to return to the board.
- **Components:** Activity Timeline (showing when applied, when interviewed) and an embedded Notes editor.

## 4. Resume Builder & Analyzer
**UX Pattern:** Split-View Editor (Notion/Framer)
- **Why:** You need to see the source material and the output simultaneously.
- **Hierarchy:** 
  - Left panel: The AI extracted skills, form fields, or original PDF.
  - Right panel: The live, rendered resume preview.
- **AI Integration:** An "Improve with AI" button floating near textareas that opens an inline popover with suggestions.

## 5. Learning Roadmap
**UX Pattern:** Interactive Timeline / Journey Map (Duolingo)
- **Why:** Standard lists are demotivating. Visualizing a path from A to B encourages completion.
- **Hierarchy:** Vertical nodes connected by a line. Completed nodes are bright/primary color; future nodes are muted. Clicking a node opens a modal with study details.

## 6. AI Interview Prep & Coding Practice
**UX Pattern:** Focus Mode / IDE Layout (LeetCode/GitHub)
- **Why:** The user needs zero distractions when practicing.
- **Hierarchy:** 
  - The Sidebar collapses completely.
  - Left side: Problem description.
  - Right side: Code editor or textarea for the answer.
  - Bottom panel: AI Feedback drawer that slides up upon submission, providing a score and an optimized reference answer.

## 7. Analytics / Progress
**UX Pattern:** Modular Data Dashboard (Stripe)
- **Why:** Separating this from the main dashboard prevents data overload.
- **Hierarchy:** Large aggregate numbers at the top (Total Hours, Average Score). Detailed charts (Skill Radar, Weekly Bar Charts) below. 
- **Accessibility:** Ensure all charts have tooltips on hover and sufficient contrast between data series.

## 8. Settings & Profile
**UX Pattern:** Left-Tabbed Vertical Layout (GitHub)
- **Why:** Settings pages grow infinitely. Vertical tabs on the left scale much better than horizontal tabs.
- **Hierarchy:** Categories on the left (Profile, Notifications, Integrations, Billing). Forms on the right, constrained to `max-w-2xl`.

## 9. Admin Dashboard
**UX Pattern:** Data-Dense Master-Detail (Supabase)
- **Why:** Admins need to scan massive amounts of user data quickly.
- **Hierarchy:** High-density tables with advanced filtering and sorting. Clicking a user opens a comprehensive detail page showing their telemetry and activity logs.
