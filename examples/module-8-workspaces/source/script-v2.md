# Module 8 — Workspaces v2 (boundary cut) — redo/module-8-workspaces

Registered as `module-8-workspaces-v2` alongside v1 (which stays
renderable). One continuous ~62s piece — concept beats only; live-product
tours remain screen-recordings, intercut separately.

**The one idea:** a workspace is the boundary of a Sim system. The box
holds three kinds of things — the objects, the members, and the connected
credentials. You don't share objects; you add people to the box. You don't
wire accounts into blocks; you connect them to the box, and everything
inside can use them.

**Audience:** watched the intro (knows the object tiles); teams evaluating
Sim. **Deliberately not taught:** role matrices (Read/Write/Admin named in
VO only), billing/seats, SSO, the secrets-vs-OAuth-credentials split, org
roles.

**Macro arc:** outside-in zoom (module-1's accepted arc) — the box and what
attaches to it → zoom *into* one workflow for the single mechanistic
example → fold back out and settle on the box as the unit.

**One run total.** The only start→finish traversal is the credential
resolution in scene 5 (the docs' own credential-share example): one
Credential block, three pulses, three `<credential.credentialId>` tags
resolving in sync. Scene 3's blocked reach and scene 4's port opening are
state cues, not runs — no other traversal would prove anything new.

**Grounding** (see `demo-corpus/credential-share.md`):
- Workspace label `beaming-polaris` — the real workspace from the module-5
  artifacts; keeps the series in one world.
- Scene 5 chain = `CREDENTIAL_SHARE_WORKFLOW` verbatim (names, colors,
  rows, positions ×1.5, edges).
- The account identity `waleed@company.com` = the docs' own `displayName`
  example. The tag visually resolves to the displayName rather than the
  raw UUID `credentialId` — the docs use the displayName as the
  human-facing identity and the UUID would be unreadable on screen.
  **Flag for William:** if this reads as fudging, the honest alternative
  is resolving to a UUID-style string.
- Second workspace in scene 3 is labeled with the plain noun "another
  workspace" — no invented company names.

**Batch-mode assumptions** (no interview happened):
- Viewer knows the object tiles (intro) and what a workflow run looks like
  (module 1), so scene 1 spends no time re-teaching tiles and scene 5 can
  use run grammar directly.
- Members are identity chips, not roles: all dots are the same neutral
  chip; a joining member gets a brief selection-ring pulse. Roles stay in
  narration ("each with a permission level — read, write, or admin").
- "Credential" is presented as *the connected account* (the docs'
  integration sense) because that's what the chosen example demonstrates;
  workspace-vs-personal secrets are out of scope for this cut.

## Locked scene list (62s)

1. **one-box** (8s — assemble) — The boundary panel draws itself, labeled
   `beaming-polaris`; the four resource tiles the viewer already knows
   (Workflow, Table, Knowledge Base, File) fade in staggered inside, each
   with a soft entrance. Nothing else.
   *Beat intent: everything one system needs lives in one box.*
2. **members-join** (10s — assemble + access sweep) — Three person dots
   dock onto the boundary ring itself (the docs' own visual note: members
   attach at the workspace ring). First dot (you) docks quietly. As each
   further member docks — brief selection-ring pulse on the dot — a soft
   scale-pulse sweeps across ALL four tiles in order: joining the box IS
   gaining access to everything in it. No arrows, no per-object grants.
   *Beat intent: you don't share objects one by one — you add people to
   the box.*
3. **the-boundary** (10s — cluster-split / isolation) — The panel glides
   left as a unit; a second, smaller panel ("another workspace", its own
   workflow tile, its own two members on its ring) fades in at right. A
   thin reach line draws from the other workspace's Workflow toward our
   Table — and stops dead at our border: red blip, ✗ stamp at the
   crossing point. Line and stamp fade; the second workspace fades away.
   Panel stays left.
   *Beat intent: resources never leave the box; a workflow in one
   workspace cannot read a table in another.*
4. **connect-an-account** (12s — port-open; the padlock-port metaphor kept
   from v1 review) — A circular padlock port grows on the right edge of
   the ring. Outside, Gmail / Drive / Calendar tiles fade in, dimmed. A
   key chip — Google — slides in from outside and is absorbed into the
   port; the shackle swings open and the port chip turns green. Connection
   lines draw from the port to all three services as they undim, each with
   a brief selection blip. The account identity `waleed@company.com`
   settles INSIDE the panel beside the port; a soft pulse sweeps the tiles
   (everything inside can use it now).
   *Beat intent: you connect an account to the workspace, once — and the
   integration is unlocked for everything and everyone inside.*
5. **one-credential-three-blocks** (14s — zoom-through → run +
   reference-resolution; the centerpiece) — Everything but the Workflow
   tile dims; the camera pushes into the tile and crossfades to the canvas:
   the docs' credential-share workflow assembles (Credential → Gmail /
   Drive / Calendar, edges drawing on). The Credential block rings live;
   three glowing dots leave its handle together and are absorbed by the
   three blocks; the three `<credential.credentialId>` tags glow and
   resolve IN SYNC to `waleed@company.com`, with dwell time. Resolutions
   revert; template state holds.
   *Beat intent: select the credential once; every block follows. VO
   anchor (docs caption): "Change the account in one place and every
   block follows."*
6. **the-unit** (8s — zoom-back-out → settle) — The canvas folds back into
   the Workflow tile; the service tiles and their lines fade; the panel
   glides home to center carrying everything it owns. One quiet recap
   pulse in claim order — tiles sweep (objects), member dots ring
   (members), port glows (credentials). Hold the balanced frame.
   *Beat intent: the workspace is the unit — what a team shares, and what
   you eventually hand to a customer.*

## Continuity contract

- One set piece: the workspace panel. All geometry in `layout-v2.ts`
  (`PANEL_HOME_X` / `PANEL_LEFT_X`, tile grid, ring-dot anchors, port
  center, service stack, chain origin). Scenes pass state props only.
- Panel position: HOME (scenes 1–2) → glides to LEFT inside scene 3 →
  LEFT (scenes 3–5) → glides back to HOME inside scene 6. Both moves are
  interpolated transforms of the same component; nothing relayouts.
- Boundary pairs: 1→2 panel+tiles at HOME; 2→3 adds three docked dots;
  3→4 panel at LEFT, second workspace fully gone, no port yet (the port
  fades in at the top of scene 4 — its introduction IS the scene);
  4→5 panel at LEFT with open green port, account label inside, services
  + connection lines at rest; 5→6 the canvas at template state (tags
  unresolved, no rings, edges drawn). Verified by pixel diff
  (`bun scripts/verify-boundaries.ts module-8-workspaces-v2`).
- Scene 5 opens on the IDENTICAL scene-4 end frame, then moves the camera;
  scene 6 re-renders that same world during the fold-out before gliding
  home. All resolutions revert before scene 5 ends.
- Product state language only: selection-blue rings (docked member, live
  block, unlocked service), green ok (open port), red blip + ✗ (blocked
  reach), 0.35 dim (not focal), scale pulse (changed/accessible). No state
  words on screen. The only text: the workspace labels, tile nouns,
  service nouns, block rows (docs-authored), and `waleed@company.com`.
