# Scene 3 — `the-workflow`  ·  archetype: **assemble (camera reveal)**

Source: `../source/scenes/TheWorkflowScene.tsx`, `../source/scenes/_v2.tsx`,
`../source/layoutV2.ts`, `../source/dataV2.ts`.

The scene that attaches a workflow to the table. The camera eases out from the
table-centered framing to identity, the table glides to the top of frame, and the
read→classify→write chain assembles below it — the docs' exact roundtrip
workflow. This is where the two halves of the set piece (table + chain) are first
seen together.

---

## What this scene is for

The table is established and its axes are taught. Now the mechanism: a workflow
**reads** the table, **processes**, and **writes back** — and it does so through
**Table blocks**. This scene introduces the chain as a concrete object and places
it in fixed relation to the table, so the run scenes can act across both.

The one idea: **a workflow attaches to the table** — one block reads, one writes.
No run yet; just the chain coming into being.

## The camera reveal — same layout, camera only

The table doesn't move. The *camera* does:

```ts
const camM = ramp(t, 0.4, 1.7, EASING.inOut);
const cam  = camMix(CAM_TABLE, CAM_ID, camM);  // 1.18× table-centered → identity
```

Easing from `CAM_TABLE` (table centered, 1.18×) to `CAM_ID` (whole stage, 1×)
pulls back and reframes, so the table *appears* to glide up to the top of frame
and shrink — but in stage space nothing moved. The table has been at its fixed
`layoutV2` position the whole time; the camera just stops framing it as the hero
and starts framing the whole stage.

> *"Why is this a camera move and not the table animating its position?"* Because
> the table is a persistent element that lives across every scene — and the rule
> is you never teleport or relayout a persistent element. Its stage coordinates
> are fixed in `layoutV2`. Moving the *camera* over fixed geometry gets the
> "table glides to the top" read while keeping the table's true position constant,
> which is what makes scenes 1→2 (table-framed) and 3→7 (stage-framed) the same
> set piece rather than two layouts. Camera over geometry, never geometry under
> camera.

## The chain assembles the docs way

As the camera settles, the roundtrip chain builds left to right, block-then-edge:

```ts
const queryIn    = ramp(t, 1.7, 2.3, EASING.out);   // Table (Query Rows) fades in
const edge1      = ramp(t, 2.5, 3.1, EASING.inOut);  // edge draws on
const classifyIn = ramp(t, 3.1, 3.7, EASING.out);   // Classify (agent)
const edge2      = ramp(t, 3.9, 4.5, EASING.inOut);  // edge draws on
const updateIn   = ramp(t, 4.5, 5.1, EASING.out);   // Table (Update Rows)
```

Block, then its outgoing edge, then the next block — the same way the docs'
workflow preview assembles. The result is the verbatim `TABLE_ROUNDTRIP_WORKFLOW`:
**Table `Query Rows` (Filter `status = 'unprocessed'`) → Classify
(`Classify <table.rows>`) → Table `Update Rows` (Set `category, status =
'qualified'`)**.

> *"Why assemble block-by-block instead of fading the whole chain in at once?"*
> Because the chain has an order that *is* the lesson — read, then process, then
> write — and assembling left to right with edges drawing between blocks makes
> that flow direction visible before any run happens. A simultaneous fade-in would
> show three blocks; the staggered build shows a pipeline. The edges drawing
> in their own beat (after each source block, before its target) reinforces
> direction.
>
> *"Why are both end blocks the same `Table` block?"* That's the point of the
> whole module — one block type both reads and writes the table. The first Table
> block does `Query Rows`, the last does `Update Rows`. Same icon, same color,
> different operation. Showing them as the same block type is the visual claim
> that reading and writing a table are the same kind of operation, just two
> directions.

## Grounding — every value traces to the docs

Nothing on the chain is invented. The blocks, operations, filter, and set clause
are `TABLE_ROUNDTRIP_WORKFLOW` from the docs' workflow-preview examples, verbatim;
the Table block's color (`#10B981`) and lucide `Table` icon are re-verified against
the product's block definition. The `<table.rows>` reference is the docs' exact
string. This is the *port-don't-design* rule applied to the chain — you're
configuring the workflow the docs ship, not drawing a plausible-looking one.

## Exit state (what scene 4 inherits)

`camera at identity (CAM_ID) · chain fully assembled and idle (all blocks in,
both edges drawn, no rings) · table unprocessed (category empty, status all
unprocessed)`. Scene 4 opens on this exact idle frame and fires the run — the
Query ring comes on and the rows begin to light.
