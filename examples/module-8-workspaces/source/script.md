# Module 8 — Workspaces, Credentials, Permissions

Conceptual spine for the three-video Module 8 sequence (Workspaces Intro · Credentials & Integrations · Permissions & Handoff). Remotion owns only the **concept beats**: the cold-open framing of a workspace as a *system boundary*, the diagram that shows what lives inside it, the credential/integration distinction, the personal-vs-shared split, the roles ladder, and the handoff-checklist recap. Everything that is "open Sim, go to workspace settings, add a credential, invite a member, flip a role" is a **[SCREEN-REC]** demo captured from the live product and intercut — those are marked below but not animated. The thesis the animation has to land: *a workspace is the boundary of a Sim system — resources, credentials, members, deployments, and handoff all live inside one box, and for a customer that box becomes their app.*

Each video's concept beats are kept short and diagrammatic so the screen-rec demos carry the runtime. All diagrams are built from the existing `ObjectNode` vocabulary plus a small number of new shared primitives (a neutral `BoundaryFrame`, a `CredentialKey` auth node, a `RoleBadge`, and a `ChecklistCard`) so the look stays consistent with the rest of the series.

## Locked scene list

### Video 1 — Workspaces Intro

1. **workspace-is-a-boundary** (6s) — A single labeled box draws itself: "my workspace." One line: "a workspace is the boundary of a system." Establishes the box everything else lives inside.
   - Components: `BoundaryFrame` (new), `FadeIn`, `Highlight`
2. **what-lives-inside** (10s) — The core objects fade into the boundary as tiles: Workflow, Table, File, Knowledge Base, Tool, Logs, Deployment — and `CredentialKey` for credentials. The keystone "everything a system needs lives in one box" beat.
   - Components: `BoundaryFrame`, `ObjectNode` (workflow, table, file, knowledge, tool, logs, deployment), `CredentialKey` (new), `FadeIn`, `SlideIn`
3. **personal-vs-team** (8s) — Two boundaries side by side: a "personal" workspace (one figure, experiments) and a "team / customer" workspace (multiple members on the same box). "Same box — but who's standing around it changes everything."
   - Components: `BoundaryFrame` (×2), `ObjectNode`, `RoleBadge` (new, as member dots), `SlideIn`, `Highlight`
4. **[SCREEN-REC] tour-a-workspace** — Live Sim: open a workspace, show the sidebar of resources, folders, switch between personal and team workspace. *(not animated)*
5. **workspace-as-customer-app** (6s) — The team boundary re-labels itself "customer app" and a handoff arrow slides it from a "you" figure to a "customer" figure. "For a partner, the workspace *is* the thing the customer will own and run."
   - Components: `BoundaryFrame`, `SlideIn`, `Highlight`, `FadeIn`

### Video 2 — Credentials & Integrations

6. **why-credentials** (6s) — A Workflow tile inside the boundary reaches toward external services (Slack, Google, an API, a DB) sitting *outside* the boundary; the reach is blocked by a closed gate. "Workflows constantly need to call the outside world."
   - Components: `BoundaryFrame`, `ObjectNode` (workflow, tool), `BrandIcons` (Slack/Google/PDF as stand-ins), `CredentialKey`, `SlideIn`, `Highlight`
7. **integration-vs-credential** (8s) — Two stacked rows define the terms: *Integration* = the connection/capability (a labeled pipe to a service); *Credential* = the auth material that unlocks it (`CredentialKey`). The key drops into the pipe and the gate opens. "The integration is the door; the credential is the key."
   - Components: `CredentialKey` (new), `ObjectNode` (tool), `BrandIcons`, `Expand`, `FadeIn`, `Highlight`
8. **personal-vs-workspace-credentials** (8s) — The `CredentialKey` appears in two places: one tied to a single member (personal), one living in the workspace boundary itself (shared). Arrows show which workflows can use which. "Whose key is it — yours, or the workspace's?"
   - Components: `BoundaryFrame`, `CredentialKey`, `RoleBadge`, `Highlight`, `SlideIn`
9. **[SCREEN-REC] add-a-credential** — Live Sim: open workspace settings, add a workspace credential, connect an integration, use it inside a block. *(not animated)*
10. **own-your-secrets** (6s) — Recap card: a hardcoded secret (struck through) vs. a `CredentialKey` held inside the boundary, with the boundary handing off to a "customer" figure. "Don't hardcode secrets. Keep them in the workspace — and when you hand off, the customer should own them."
    - Components: `BoundaryFrame`, `CredentialKey`, `ChecklistCard` (new, mini), `Highlight`, `FadeIn`

### Video 3 — Permissions & Customer Handoff

11. **why-permissions** (5s) — The team boundary from scene 3 returns; members reach for resources and some reaches are blocked. "Not everyone should edit — or even see — everything."
    - Components: `BoundaryFrame`, `RoleBadge`, `ObjectNode`, `Highlight`, `SlideIn`
12. **roles-ladder** (8s) — A vertical ladder of `RoleBadge`s — Owner / Admin / Write / Read — each rung lighting up with what it can do (a small permission strip beside it). "Roles stack: each one can do everything below it, plus more."
    - Components: `RoleBadge` (new), `Expand`, `Highlight`, `FadeIn`
13. **internal-vs-external** (6s) — The boundary's members sort into three labeled groups: team, contractor/partner, customer stakeholder — each carrying a different `RoleBadge`. "Same workspace, different kinds of people — give each the role that fits."
    - Components: `BoundaryFrame`, `RoleBadge`, `SlideIn`, `Highlight`
14. **[SCREEN-REC] invite-and-set-roles** — Live Sim: invite a member, assign a role, show what a read-only member sees vs. an admin. *(not animated)*
15. **handoff-checklist** (9s) — The closing recap: a `ChecklistCard` builds line by line as the boundary slides from "you" to "customer" — workspace owned, credentials customer-owned, deployments live, rollback known, logs accessible, resources organized, notes included. "Handoff is a checklist. A partner doesn't just build — they hand over a workspace the customer can govern and run."
    - Components: `ChecklistCard` (new), `BoundaryFrame`, `ObjectNode` (deployment, logs), `CredentialKey`, `RoleBadge`, `FadeIn`, `Highlight`, `SlideIn`

Total animated ≈ 62s across 11 concept beats (4 screen-rec demos slot in between, captured separately).

## Narration (reference)

### Video 1 — Workspaces Intro

> A workspace is the boundary of a system. Think of it as one box.
> Inside that box lives everything the system needs: your workflows, your tables, your files, your knowledge bases, your tools, your logs, your deployments — and the credentials that let them reach the outside world.
> It's the same box whether you're alone or on a team — but who's standing around it changes everything. A personal workspace is your own sandbox. A team or customer workspace is a shared environment several people operate together.
> *(demo: tour a real workspace)*
> And here's the part that matters for partners: for a customer, the workspace *is* the app. It's the thing they'll own, run, and maintain after you hand it over.

### Video 2 — Credentials & Integrations

> Workflows are constantly reaching for the outside world — Slack, Google, an API, a database, an MCP server. But they can't just walk through the door.
> So it helps to separate two words. An *integration* is the connection — the door to a service. A *credential* is the auth material — the key that opens it. The integration is the door; the credential is the key.
> And keys can live in two places. A *personal* credential belongs to one member. A *workspace* credential lives in the workspace itself, available to the system running there. The question to always ask: whose key is this?
> *(demo: add a workspace credential and use it in a block)*
> Two rules. Don't hardcode secrets into workflows — keep them in the workspace. And when you hand a system to a customer, the production credentials should be *theirs*.

### Video 3 — Permissions & Customer Handoff

> Once a workspace is shared, not everyone should edit — or even see — everything. That's what permissions are for.
> Roles stack like a ladder. Read can view. Write can build. Admin can manage members and settings. Owner holds the whole thing. Each role can do everything below it, plus more.
> The same workspace holds different kinds of people — your team, contractors or partners, customer stakeholders. Give each one the role that actually fits.
> *(demo: invite a member and set their role)*
> And handing a system off is a checklist. The customer owns the workspace, or is invited properly. The credentials are customer-owned. The deployments are live, and the rollback path is known. The logs are accessible. The resources are organized, with notes. Because a partner doesn't just build a workflow — they hand over a workspace the customer can actually govern and run.
