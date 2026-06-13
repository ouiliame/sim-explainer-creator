# outbound-machine demo corpus

Every on-screen value traces to `../data.ts`. Two provenance classes:

## Registry/docs-verbatim (product truth)

| On screen | Source |
| --- | --- |
| Apollo block name/color/glyph | `apps/sim/blocks/blocks/apollo.ts` (#EBF212), ApolloIcon icons.tsx:4714 |
| `Operation \| Search Organizations` | apollo.ts `apollo_organization_search` |
| `Employees \| 50–500` | docs filter `organization_num_employees_ranges`, humanized |
| Enrich container chrome | `subflows/parallel/parallel-config.ts` (SplitIcon, #FEE12B), docs preview-container anatomy |
| `Parallel Type \| Parallel Each`, `Parallel Items \| <apollo.organizations>` | parallel editor verbatim |
| `<parallel.currentItem>`, `<parallel.results>` | workflows/blocks/parallel.mdx (results aggregation is the docs' own after-the-parallel pattern) |
| Data Enrichment name/color/glyph | `enrichment.ts` (#9333EA), EnrichmentIcon |
| `Operation \| Build Full Contact` | enrichment.ts build-full-contact template |
| Provider chip (Hunter) | enrichment.ts `provider` output; docs example values Hunter / People Data Labs |
| Personalize (Agent) color/glyph | `agent.ts` (#33C482 var(--brand)), AgentGlyphW |
| `Model \| claude-sonnet-4.6` | landing templates' authored model value |
| Instantly name/color/glyph | `instantly.ts` (#FFFFFF), InstantlyIcon icons.tsx:454 |
| `Operation \| Create Lead` | instantly.ts `instantly_create_lead` |
| Table block name/color/glyph | `table.ts` ("Table", #10B981), TableIcon icons.tsx:6487 |
| `Operation \| Batch Insert Rows` | table.ts `batch_insert_rows` (the one multi-row write) |
| Table grid (SimTable) | verbatim app table-grid port, module-2 derivation, native ×2 |
| sent-status lowercase style | module-2's docs-verbatim status style |

Declared divergence: the Table block's `Rows` row title abbreviates the
registry editor label `Rows Data (Array of JSON)` for canvas legibility.

## Authored demo stand-ins (declared, standing in for run artifacts)

- The six leads (company/contact/title/signal) and six DISTINCT 2-line
  personalized openers — `data.ts` `LEADS`. Stand-in for the agent's real
  output (⟨pending⟩), exactly as swe-fleet's PR numbers.
- `Campaign | Q3 Outbound` (Instantly campaign label).
- `Table | outbound` (the table's name).
- `LANDED_ORDER` — the parallel completion order (= insert order); the
  scramble itself is parallel.mdx's "result order is not guaranteed",
  drawn.

## Demo flow supported

One run: Apollo finds 6 organizations → the Enrich parallel runs the lane
once per org (enrich → personalize → send) → the Table block batch-inserts
`<parallel.results>` → six record rows land in the `outbound` table, each
ending `sent`.
