# on-call-v2 demo corpus — authored stand-ins, declared

No real run artifact exists for this workflow, so per the ⟨pending⟩ rule
every run-derived value on screen is an AUTHORED STAND-IN (the swe-fleet
PR-number / growth-machine opener precedent), all defined in one place:
`../data.ts`. This file is the trace.

## Product truth (NOT stand-ins — re-derived 2026-06-12 from `_reference/sim`)

| On screen | Source |
| --- | --- |
| Webhook block, `#10B981`, `Webhook URL` row title | `blocks/generic_webhook.ts`, `triggers/generic/webhook.ts:16` |
| `…/trigger/d8abcf0d…` URL display | the generic-webhook docs' own bestPractices curl UUID (same display as the accepted webhooks video) |
| Agent rows `Messages` / `Model` / `Tools` | `blocks/agent.ts` subBlock titles |
| Agent output shape `content · tokens · toolCalls` | `blocks/agent.ts` outputs + bestPractices |
| Sentry chip `#362D59`, Datadog `#632CA6`, GitHub `#181C1E` | each block's registry `bgColor` |
| Tool ids `sentry_issues_get`, `datadog_query_logs`, `github_latest_commit` | the registries' real operation ids (all READS) |
| Slack `Send Message` / `Channel`; Linear `Create Issue` / `Team`; PagerDuty `Create Incident` / `Urgency: High` | `slack.ts`, `linear.ts` (V2), `pagerduty.ts` operation labels + subBlock titles (all CREATES) |
| Block/brand glyphs | `apps/sim/components/icons.tsx`, ported verbatim |

## Authored stand-ins (declared)

- **The six incidents** (`INCIDENTS`): Sentry-issue-flavored titles +
  services (`TypeError: cart is null` / `checkout-api`, …). The followed
  run handles row 3, `HTTP 500 /payments` / `payments-api`.
- **Status vocabulary** `firing → triaged → assigned` — the incident
  table's authored lifecycle, flipped only in sync with the run's real
  records (triaged = the agent's summary exists; assigned = the PagerDuty
  incident exists). Lowercase plain cell text per module-2/swe-fleet style.
- **Durations** (`LOG_DURATIONS`, tool-call `NNNms · result` values),
  **token counts**, and the **content line**
  (`payments-api — 500s began with deploy 4f2c1…`) — plausible-shape
  stand-ins in module-7's accepted record format.
- **Channel `#incidents` / team `Platform`** — authored config values.
- **`<sentryalerts.message>`** — generic-webhook docs' root-field example
  shape (a literal Sentry payload nests deeper; script assumption 4).

Nothing on screen claims the agent edits or redeploys anything: the three
tool calls are reads, the three terminals create records, and the demo
copy mentions no fix, rollback, or deploy action.
