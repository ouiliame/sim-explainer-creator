# branching — demo corpus

This video runs entirely on the docs' own authored examples; there is no
invented demo content. Index of sources:

- **Act 1 workflow** — `CONDITION_ROUTE_WORKFLOW`
  (`~/sim/sim/apps/docs/components/workflow-preview/examples.ts:235`):
  Start {Input: Ticket} → Condition [If `<start.priority> === 'high'` /
  else] → Escalate / Reply (agents). Copied verbatim into
  `../layout.ts` + `../scenes/_fork.tsx`.
- **Act 2 workflow** — `ROUTER_TRIAGE_WORKFLOW` (`examples.ts:494`):
  Start → Router {Context: `<start.input>`, Model: claude-sonnet-4-6}
  with routes Sales / Support / Billing → three agents.
- **Semantics** — condition.mdx, router.mdx, how-it-runs.mdx ("Only the
  branch that is taken runs. A block on a branch that didn't run produces
  no output").

## Pending artifact request (replaces ⟨pending⟩ markers in script-v1.md)

One real run of a Router-triage workflow in a live workspace would supply:

1. Run B's start payload (a non-high-priority ticket) so the If row can
   resolve `<start.priority>` to a real value instead of carrying the
   verdict by choreography alone.
2. Run C's raw ticket text so the Context row's `<start.input>` can
   ResolvedTag-resolve (truncated; full value in Start's row).
3. Run C's record: log durations (Start / Router / chosen agent), the
   actual `selectedRoute`, and the `reasoning` string — currently the
   record shows duration-less rows and a single doc-derived
   `selectedRoute: "support"`.

Store the response verbatim here when it arrives.
