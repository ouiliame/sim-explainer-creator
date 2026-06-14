# Sim Block Schemas — authoritative reference for video builder agents

**Purpose.** When a Sim explainer video shows a workflow on the canvas, every block on
screen — its name, brand tile color, the fields inside it, the dropdown option labels,
the `<block.field>` references downstream blocks read — must be REAL. This file is the
single source of truth for those values. Read the one block entry you are putting on
screen and copy the exact field ids / option ids / output names. **Do not invent block
config fields or values.** If a field is not listed here, it does not exist on that block.

---

## How this was derived (and how to keep it current)

This is a hand-compiled mirror of the same metadata that Sim's own workflow-building
copilot (the "mothership" agent) consumes at build time. The copilot does NOT read the
raw block files; it calls a server tool that *compiles* the registry into a clean
per-block schema. We reproduce that compiled shape statically so video agents ground on
the same truth.

**Source files (in `_reference/sim/apps/sim/`):**

- `blocks/blocks/*.ts` — the registry. One `BlockConfig` per block. This is the ground
  truth for `subBlocks` (config fields), `tools.access`, `outputs`, `bestPractices`,
  `bgColor`, `category`, `triggers.available`.
- `blocks/types.ts` — the `BlockConfig` / `SubBlockConfig` types (the shape every block
  obeys). Notably: a subblock's `condition: { field, value }` is what gates a field to a
  particular operation; `canonicalParamId` is the runtime param a pair of basic/advanced
  subblocks both write to.
- `blocks/registry.ts` — `getBlock(id)` / `getAllBlocks()`; the index of every block.

**The live equivalent (what the copilot actually calls):**

- `lib/copilot/tools/server/blocks/get-blocks-metadata-tool.ts` — `get_blocks_metadata`.
  Given block ids, returns each as `CopilotBlockMetadata`: `inputSchema` (common config
  fields), `operationInputSchema` / `operations` (per-operation fields + the tool each
  operation calls), `tools`, `triggers` (+ each trigger's `configFields` & `outputs`),
  `outputs`, `bestPractices`, `authType`. The headings in this doc mirror that shape.
- `lib/copilot/tools/server/blocks/get-trigger-blocks.ts` — `get_trigger_blocks`. Lists
  which blocks can be the workflow's trigger (entry point).
- `lib/copilot/tools/server/workflow/edit-workflow/` — `edit_workflow`. The tool the
  agent emits to actually build/modify a workflow (operation/validation format below).

**To refresh:** re-read the block file under `blocks/blocks/<id>.ts` and update the entry.
The product moves; re-derive at the start of every build that touches a given block.
Where a value is resolved dynamically at runtime (e.g. the full model list, OAuth scopes,
selector-populated option lists), it is marked ⟨pending⟩ — those cannot be known
statically and should be shown as a representative placeholder, never invented as fact.

---

## How the copilot is taught to build workflows (the loop the doc grounds)

The system prompt and the agent loop themselves are **server-side**, in the closed-source
"mothership" backend — NOT in the OSS clone. The clone resolves the mothership URL
(`lib/copilot/server/agent-url.ts`, env `COPILOT_{DEV,STAGING,PROD}_URL`) and streams
from it; the copilot route (`app/api/copilot/chat/stream`) and `app/api/mothership/chat`
are thin shims. What lives in the clone are the **tools** the mothership calls and their
**descriptions** (the usage guidance the model sees). The teaching is therefore: a tool
loop, not a giant static prompt.

The loop, in order:

1. **`get_trigger_blocks`** → which blocks can be the entry point.
2. **`get_blocks_metadata([...ids])`** → for each block it intends to use, the compiled
   schema (this doc's shape). This is where the model learns the exact field ids and
   option values — so it does not invent them. The mothership is explicitly told (in the
   `edit_workflow` param description) to read this metadata first.
3. **`edit_workflow({ operations })`** → emits operations to add/edit/delete blocks and
   wire edges. The server validates against the registry and self-heals forward edges.

### The `edit_workflow` operation format (what the agent emits)

`edit_workflow` takes `{ operations: [...], workflowId? }`. Each operation
(`EditWorkflowOperation`, see edit-workflow/`types.ts`):

```jsonc
{
  "operation_type": "add" | "edit" | "delete" | "insert_into_subflow" | "extract_from_subflow",
  "block_id": "string",      // for "add", the DESIRED id of the new block
  "params": { ... }          // optional
}
```

`params` shape (verbatim from the tool description in `tool-catalog-v1.ts`):

- **add:** `{ "type": "agent", "name": "My Agent", "inputs": { "model": "<model-id>" }, "connections": { ... } }`
- **edit:** `{ "inputs": { "temperature": 0.5 } }` — keyed by **subblock id**, NOT
  `{ "subBlocks": { "temperature": { "value": 0.5 } } }`.
- **delete:** omit `params` entirely.

**`inputs` keys are subblock `id`s** (the field ids in this doc). **`inputs` values for a
dropdown must be one of that dropdown's option `id`s** (validation rejects anything else
with `Invalid dropdown value "X". Valid options: ...`). Unknown field ids are rejected
with `Unknown input field "X" for block type "Y"` (except `loop`/`parallel`, which pass
extra fields through).

### Connections / edges (how blocks are wired)

`params.connections` is keyed by **source handle** → target(s). A target is a string
block id, `{ block, handle? }`, or an array of those. From edit-workflow/`builders.ts` +
`validation.ts`, the valid **source handles** per block type:

- Normal block: `source` (the default out), `error` (error path). `success` is accepted
  as an alias for `source`.
- **condition** block: `if`, `else-if`, `else` (or `else-if-2`, …). Stored internally as
  `condition-{conditionId}`.
- **router** (`router_v2`): `source`, plus one handle per route. Stored as `router-{routeId}`.
- **loop** block: `loop-start-source` (into the body), `loop-end-source` (after the loop),
  `error`.
- **parallel** block: `parallel-start-source`, `parallel-end-source`, `error`.
- Target handle is `target` by default.

A forward-referencing edge (target block not added yet) is NOT an error — it is recorded
as a pending connection and wired automatically once the target exists, possibly on a
later `edit_workflow` call (DEFERRED_SKIPPED_ITEM_TYPES = `invalid_edge_target`).

### What makes a workflow well-formed (validation rules that matter on screen)

From edit-workflow/`validation.ts` + `types.ts` skipped-item types:

- A block's `type` must exist in the registry; its name must be unique
  (`duplicate_block_name`) and not reserved (`reserved_block_name`).
- Exactly the right trigger discipline: only one of a `singleInstance` block; no
  duplicate trigger (`duplicate_trigger`).
- Edges must reference real source/target handles for the block type (lists above) or
  they are skipped (`invalid_source_handle` / `invalid_target_handle`).
- Subflow parenting: `loop`/`parallel` cannot nest inside another `loop`/`parallel`
  (`nested_subflow_not_allowed`); only valid blocks go into a subflow
  (`invalid_subflow_parent`).
- Required params that are missing are reported (`missing_required_params`).

---

## Reference conventions used below

- **id** = the `type` string (what `add`'s `params.type` is, and the block's registry key).
- **trigger?** = can this block be the workflow entry point (`get_trigger_blocks` includes
  it). A block is a trigger if `category: 'triggers'`, or `triggerAllowed: true`, or it has
  a subblock with `mode: 'trigger'`.
- **CONFIG SUBBLOCKS** = `BlockConfig.subBlocks`. Field `id` is what goes in `inputs`.
  `req` = required. `cond` = the `condition` that shows the field (usually keyed on
  `operation`). basic/advanced = which editor mode shows it (both are valid to set).
  For basic/advanced PAIRS that share a `canonicalParamId`, set EITHER — they write the
  same runtime param (e.g. `tableSelector` and `manualTableId` both → `tableId`).
- **OPERATIONS** = blocks with an `operation` dropdown; each option id maps to a tool and
  unlocks its own fields.
- **OUTPUTS** = `BlockConfig.outputs`; downstream blocks read these as `<blockName.field>`.

---

# Core blocks

## `agent` — Agent

- **name:** Agent · **category:** blocks · **bgColor:** `var(--brand)` (Sim brand purple) · **icon:** `AgentIcon`
- **trigger?** no · **authType:** API Key (provider key)
- **bestPractices:** *Prefer using integrations as tools within the agent block over
  separate integration blocks unless complete determinism needed. Response Format should
  be a valid JSON Schema — it determines the output of the agent only if present; fields
  are accessed at root level by following blocks (e.g. `<agent1.field>`). If no response
  format, the agent returns the standard outputs: content, model, tokens, toolCalls.*

**CONFIG SUBBLOCKS:**

| id | type | title | req | notes |
|---|---|---|---|---|
| `messages` | messages-input | Messages | no | array of `{role, content}` (system/user/assistant). The system/user prompts. |
| `model` | combobox | Model | **yes** | default `claude-sonnet-4-6`. Options are the full provider model list ⟨pending⟩ — representative ids: `claude-sonnet-4-6`, `claude-opus-4-8`, `gpt-5.4`, `gpt-4o`, `o3`, `gemini-…`, `deepseek-chat`. |
| `attachmentFiles` | file-upload | Files | no | basic; canonical `files`. |
| `files` | short-input | Files | no | advanced; canonical `files`. Reference files from previous blocks. |
| `reasoningEffort` | dropdown | Reasoning Effort | no | advanced; options `auto`/`low`/`medium`/`high`; only for reasoning models ⟨pending model set⟩. |
| `verbosity` | dropdown | Verbosity | no | advanced; `auto`/`low`/`medium`/`high`; GPT-5 family ⟨pending⟩. |
| `thinkingLevel` | dropdown | Thinking Level | no | advanced; `none`/`minimal`/`low`/`medium`/`high`/`max`; extended-thinking models ⟨pending⟩. |
| `tools` | tool-input | Tools | no | the agent's tools (integrations as tools). default `[]`. |
| `skills` | skill-input | Skills | no | default `[]`. |
| `memoryType` | dropdown | Memory | no | `none`/`conversation`/`sliding_window`/`sliding_window_tokens`; default `none`. |
| `conversationId` | short-input | Conversation ID | cond | required when memoryType is conversation/sliding_window/*_tokens. |
| `slidingWindowSize` | short-input | Sliding Window Size | no | when memoryType `sliding_window`. |
| `slidingWindowTokens` | short-input | Max Tokens | no | when memoryType `sliding_window_tokens`. |
| `temperature` | slider | Temperature | no | advanced; default `0.3`; range 0–1, 0–1.5, or 0–2 depending on model. |
| `maxTokens` | short-input | Max Output Tokens | no | advanced. |
| `responseFormat` | code (json) | Response Format | no | a JSON Schema; when set, defines the agent's output fields (read at root: `<agent1.field>`). |
| `previousInteractionId` | short-input | Previous Interaction ID | no | deep-research follow-ups only. |

**TOOLS (`tools.access`):** `openai_chat`, `anthropic_chat`, `google_chat`, `xai_chat`,
`deepseek_chat`, `deepseek_reasoner`. (The actual provider tool is chosen by `model`.)
The Agent's `tools` SUBBLOCK is different: it holds the integration tools the LLM may call.

**OUTPUTS** (read as `<agent.field>`): `content` (string), `model` (string),
`tokens` (json), `toolCalls` (json), `providerTiming` (json), `cost` (json),
`interactionId` (string, deep-research only). When `responseFormat` is set, its schema's
top-level properties also become outputs at root level.

---

## `function` — Function

- **name:** Function · **category:** blocks · **bgColor:** `#FF402F` · **icon:** `CodeIcon`
- **trigger?** no
- **bestPractices:** *JS without external imports runs in a local VM (fastest); JS with
  import/require runs in an E2B sandbox; Python always runs in E2B. Reference workflow
  variables with `<blockName.output>` syntax inside code. Avoid XML/HTML tags.*

**CONFIG SUBBLOCKS:**

| id | type | title | req | notes |
|---|---|---|---|---|
| `language` | dropdown | — | no | options `javascript` / `python` (default JavaScript). Only shown when `NEXT_PUBLIC_E2B_ENABLED`. |
| `code` | code | Code | no | the function body (no signature). `<param>` for inputs, `{{ENV_VAR}}` for env vars. |

**TOOLS:** `function_execute`. **OUTPUTS:** `result` (json — the function's return value),
`stdout` (string — console output).

---

## `api` — API

- **name:** API · **category:** blocks · **bgColor:** `#2F55FF` · **icon:** `ApiIcon`
- **trigger?** no
- **bestPractices:** *Curl the endpoint yourself before filling out the API block if you
  have the auth headers. Clarify needed headers with the user.*

**CONFIG SUBBLOCKS:**

| id | type | title | req | notes |
|---|---|---|---|---|
| `url` | short-input | URL | **yes** | |
| `method` | dropdown | Method | **yes** | `GET` / `POST` / `PUT` / `DELETE` / `PATCH`. |
| `params` | table | Query Params | no | columns Key, Value. |
| `headers` | table | Headers | no | columns Key, Value. |
| `body` | code | Body | no | JSON body. |
| `timeout` | short-input | Timeout (ms) | no | advanced; default 300000, max 600000. |
| `retries` | short-input | Retries | no | advanced; default 0. |
| `retryDelayMs` | short-input | Retry delay (ms) | no | advanced. |
| `retryMaxDelayMs` | short-input | Max retry delay (ms) | no | advanced. |
| `retryNonIdempotent` | switch | Retry non-idempotent methods | no | advanced. |

**TOOLS:** `http_request`. **OUTPUTS:** `data` (json), `status` (number), `headers` (json).

---

## `condition` — Condition

- **name:** Condition · **category:** blocks · **bgColor:** `#FF752F` · **icon:** `ConditionalIcon`
- **trigger?** no
- **bestPractices:** *Write conditions in standard JavaScript except reference previous
  blocks' outputs with `<>` syntax; keep them as simple as possible, no hacky fallbacks.*

**CONFIG SUBBLOCKS:** `conditions` (type `condition-input`) — the branching rules.
**Source handles for edges:** `if`, `else-if` (`else-if-2`, …), `else`.
**TOOLS:** none. **OUTPUTS:** `conditionResult` (boolean), `selectedPath` (json),
`selectedOption` (string).

---

## `router_v2` — Router  ·  (legacy `router` = "Router (Legacy)", hidden)

- **name:** Router · **category:** blocks · **bgColor:** `#28C43F` · **icon:** `ConnectIcon`
- **trigger?** no · **authType:** API Key (provider key)
- **bestPractices:** *Write clear, specific, mutually-exclusive route descriptions. The
  context field should contain all info needed for routing. Use descriptive route names.*

**CONFIG SUBBLOCKS (`router_v2`):**

| id | type | title | req | notes |
|---|---|---|---|---|
| `context` | long-input | Context | **yes** | text the router analyzes to choose a route. |
| `routes` | router-input | — | no | route definitions (each has a description). |
| `model` | combobox | Model | **yes** | default `claude-sonnet-4-6`; same model list as agent ⟨pending⟩. |

**TOOLS:** `openai_chat`, `anthropic_chat`, `google_chat`, `xai_chat`, `deepseek_chat`,
`deepseek_reasoner`. **Source handles for edges:** `source` + one per route.
**OUTPUTS:** `context` (string), `model` (string), `tokens` (json), `cost` (json),
`selectedRoute` (string), `reasoning` (string), `selectedPath` (json).

> Legacy `router` (type `router`, name "Router (Legacy)", `hideFromToolbar`): subblocks
> `prompt` (long-input, req), `model` (combobox, req), plus hidden `temperature` /
> `systemPrompt`. Prefer `router_v2` for current videos.

---

## `response` — Response

- **name:** Response · **category:** blocks · **bgColor:** `#2F55FF` · **icon:** `ResponseIcon`
- **trigger?** no
- **bestPractices:** *Only use if the trigger is the API Trigger. Prefer Builder over
  Editor mode. The Response block is an exit point — when it executes the workflow stops
  and the API response is sent. Multiple Response blocks can sit on different branches;
  the first to execute wins. Avoid Response blocks on parallel branches with side effects.*

**CONFIG SUBBLOCKS:**

| id | type | title | req | cond |
|---|---|---|---|---|
| `dataMode` | dropdown | Response Data Mode | no | options `structured` ("Builder") / `json` ("Editor"), default `structured`. |
| `builderData` | response-format | Response Structure | no | when `dataMode = structured`. |
| `data` | code (json) | Response Data | no | when `dataMode = json`. Use `<variable.name>` refs. |
| `status` | short-input | Status Code | no | default 200. |
| `headers` | table | Response Headers | no | columns Key, Value. |

**TOOLS:** none. **OUTPUTS:** `data` (json), `status` (number), `headers` (json).

---

## `workflow` — Workflow (subworkflow / child workflow)

- **name:** Workflow · **category:** blocks · **bgColor:** `#6366F1` · **icon:** `WorkflowIcon`
- **trigger?** no · `hideFromToolbar: true`

**CONFIG SUBBLOCKS:**

| id | type | title | req | notes |
|---|---|---|---|---|
| `workflowId` | workflow-selector | Select Workflow | **yes** | basic; canonical `workflowId`; selectorKey `sim.workflows`. |
| `manualWorkflowId` | short-input | Workflow ID | **yes** | advanced; canonical `workflowId`. |
| `input` | short-input | Input Variable | no | becomes `start.input` in the child workflow. |

**TOOLS:** `workflow_executor`. **OUTPUTS:** `success` (boolean), `childWorkflowName`
(string), `childWorkflowId` (string), `result` (json), `error` (string).

---

# Control-flow blocks (special — not from a `blocks/blocks/*.ts` file)

`loop` and `parallel` are defined directly inside the metadata tool as `SPECIAL_BLOCKS_METADATA`.
They are subflow containers: blocks placed inside connect from the container's start handle.

## `loop` — Loop

- **name:** Loop · **bgColor:** ⟨container, no tile color in registry⟩ · **trigger?** no
- **bestPractices:** *Set reasonable iteration limits. Use forEach for collections, for
  loops for fixed counts. Cannot nest loops/parallels inside a loop. In YAML, connect
  inside-blocks to the block's `start` field. For while/doWhile: the condition is
  evaluated BEFORE each iteration, so blocks INSIDE the loop cannot be referenced in the
  condition — use `<loop.index>`, workflow variables, or blocks OUTSIDE the loop. To break
  on internal results, update a variables block outside the loop and reference it.*

**CONFIG (inputs):**

| id | type | title | req | notes |
|---|---|---|---|---|
| `loopType` | dropdown | Loop Type | **yes** | `for` / `forEach` / `while` / `doWhile`. |
| `iterations` | slider | Iterations | no | 1–1000; when `loopType = for`. |
| `collection` | short-input | Collection | no | when `forEach` (e.g. `<previousblock.items>`). |
| `condition` | code (js) | Condition | no | when `while`/`doWhile` (e.g. `<loop.index> < 10`). |
| `maxConcurrency` | slider | Max Concurrency | no | 1–10, default 1 (1 = sequential). |

**Source handles for edges:** `loop-start-source` (into body), `loop-end-source` (after), `error`.
**OUTPUTS:** `results` (array), `currentIndex`/`currentItem` (per-iteration, read inside as
`<loop.index>` / `<loop.currentItem>`), `totalIterations` (number).

## `parallel` — Parallel

- **name:** Parallel · **trigger?** no
- **bestPractices:** *Keep inside simple — cannot have multiple blocks within a parallel
  block; cannot nest loops/parallels. An Agent block's model combobox can be
  `<parallel.currentItem>` to query multiple models in parallel (collection = array of
  valid model strings). In YAML, connect inside-blocks to the block's `start` field.*

**CONFIG (inputs):**

| id | type | title | req | notes |
|---|---|---|---|---|
| `parallelType` | dropdown | Parallel Type | **yes** | `count` / `collection`. |
| `count` | slider | Count | no | 1–100; when `count`. |
| `collection` | short-input | Collection | no | when `collection`. |
| `maxConcurrency` | slider | Max Concurrency | no | 1–50, default 10. |

**Source handles for edges:** `parallel-start-source`, `parallel-end-source`, `error`.
**OUTPUTS:** `results` (array), `index` (number), `currentItem` (any), `items` (array).

---

# Trigger blocks (workflow entry points)

The current unified entry point is **`start_trigger`** (Start). The others are legacy
(`hideFromToolbar: true`) but still valid and appear in older workflows.

## `start_trigger` — Start  (unified, current)

- **name:** Start · **category:** triggers · **bgColor:** `#34B5FF` · **icon:** `StartIcon`
- **trigger?** YES · `triggers.available: ['chat', 'manual', 'api']` (one block serves all three)
- **bestPractices:** *Always exposes `input`, `conversationId`, and `files` fields for chat
  compatibility. Add custom input-format fields for extra structured data. Test manual runs
  by pre-filling default values in the input format.*

**CONFIG SUBBLOCKS:** `inputFormat` (type `input-format`, title "Inputs") — defines custom
input schema fields beyond the built-in `input`/`conversationId`/`files`.
**OUTPUTS:** built-in `input`, `conversationId`, `files`, plus any custom fields you define
(read downstream as `<start.fieldName>`). **TOOLS:** none.

## `schedule` — Schedule

- **name:** Schedule · **category:** triggers · **bgColor:** `#6366F1` · **icon:** `Clock`
- **trigger?** YES · `triggers.available: ['schedule']` (via `triggerAllowed`)
- **bestPractices:** *Prefer the custom cron expression input over the other schedule
  methods. Clarify the timezone if the user doesn't specify it.*

**CONFIG SUBBLOCKS** (all `mode: 'trigger'`):

| id | type | title | req | cond |
|---|---|---|---|---|
| `scheduleType` | dropdown | Run frequency | **yes** | `minutes`/`hourly`/`daily`/`weekly`/`monthly`/`custom`, default `daily`. |
| `minutesInterval` | short-input | Interval (minutes) | yes | when `minutes`. |
| `hourlyMinute` | short-input | Minute | yes | when `hourly`. |
| `dailyTime` | time-input | Time | yes | when `daily`. |
| `weeklyDay` | dropdown | Day of week | yes | when `weekly`; `MON`…`SUN`. |
| `weeklyDayTime` | time-input | Time | yes | when `weekly`. |
| `monthlyDay` | short-input | Day of month | yes | when `monthly`. |
| `monthlyTime` | time-input | Time | yes | when `monthly`. |
| `cronExpression` | short-input | Cron expression | yes | when `custom` (e.g. `0 0 * * *`). |
| `timezone` | dropdown | Timezone | no | IANA tz ids; hidden for minutes/hourly. |

**OUTPUTS:** none (initiates the run). **TOOLS:** none.

## `generic_webhook` — Webhook

- **name:** Webhook · **category:** triggers · **bgColor:** `#10B981` · **icon:** `Webhook`
- **trigger?** YES · `triggers.available: ['generic_webhook']`
- **bestPractices:** *Test by POSTing to the webhook URL. Body is read downstream by
  dot-notation, e.g. `<webhook1.message>` and `<webhook1.data.key>`. Set the Deduplication
  Field to a dot-path of a unique payload field (e.g. `event.id`) — duplicates within 7
  days are skipped. Only use when no existing integration has a triggerAllowed trigger.*

**CONFIG SUBBLOCKS** (from `triggers/generic/webhook.ts`): `webhookUrlDisplay` (the
generated URL), `requireAuth` (switch), `token` (short-input, auth token), `secretHeaderName`
(short-input), `idempotencyField` (short-input — the dot-path dedup field, e.g. `event.id`),
`responseMode` (dropdown `default`/`custom`), `verifyTestEvents` (switch), `responseStatusCode`
(short-input), `responseBody` (code), `inputFormat` (input-format). **OUTPUTS:** the posted
payload, read by dot-notation (`<webhook1.message>`, `<webhook1.data.key>`).

## Legacy trigger blocks (still valid; prefer `start_trigger`)

| id | name | bgColor | triggers.available | notes |
|---|---|---|---|---|
| `manual_trigger` | Manual (Legacy) | `#2563EB` | `['manual']` | no subblocks; plain manual start. |
| `chat_trigger` | Chat | `#6F3DFA` | `['chat']` | no subblocks. Outputs `input`, `conversationId`, `files`. |
| `api_trigger` | API (Legacy) | `#2F55FF` | `['api']` | subblock `inputFormat` (input-format). Outputs: dynamic from inputFormat + `input` (read as `<api1.paramName>`). |
| `input_trigger` | Input Form (Legacy) | `#3B82F6` | `['manual']` | subblock `inputFormat`. Used by child workflows to map parent variables. |
| `starter` | Starter | `#2FB3FF` | (manual/chat dropdown) | very old; `startWorkflow` dropdown + `inputFormat`. |

---

# Common integration blocks

These have an `operation` dropdown; each operation maps to a tool and unlocks its own fields.
**On screen, the block shows ONE operation's fields at a time** (the ones gated to the
selected operation, plus the common credential/selector fields).

## `table` — Table  (built-in data tables)

- **name:** Table · **category:** blocks · **bgColor:** `#10B981` · **icon:** `TableIcon`
- **trigger?** YES · `triggers.available: ['table_new_row']`

**COMMON SUBBLOCKS** (all operations): `operation` (dropdown, default `query_rows`);
`tableSelector` (table-selector, basic, req → canonical `tableId`); `manualTableId`
(short-input, advanced, req → canonical `tableId`).

**OPERATIONS** (option id → tool → its extra fields):

| operation | tool | extra fields (id : type — req) |
|---|---|---|
| `query_rows` | `table_query_rows` | `builderMode` (dropdown builder/json), `filterBuilder` (filter-builder), `sortBuilder` (sort-builder), `filter` (code json, editor mode), `sort` (code json), `limit` (short-input, dflt 100), `offset` (short-input, dflt 0) |
| `insert_row` | `table_insert_row` | `data` (code json — **req**) |
| `upsert_row` | `table_upsert_row` | `data` (code json — **req**) |
| `batch_insert_rows` | `table_batch_insert_rows` | `rows` (code json array — **req**) |
| `update_rows_by_filter` | `table_update_rows_by_filter` | `bulkFilterMode`, `bulkFilterBuilder` (filter-builder — req), `filter` (code json), `data` (code json — **req**), `limit` |
| `delete_rows_by_filter` | `table_delete_rows_by_filter` | `bulkFilterMode`, `bulkFilterBuilder` (req), `filter` (code json), `limit` |
| `update_row` | `table_update_row` | `rowId` (short-input — **req**), `data` (code json — **req**) |
| `delete_row` | `table_delete_row` | `rowId` (short-input — **req**) |
| `get_row` | `table_get_row` | `rowId` (short-input — **req**) |
| `get_schema` | `table_get_schema` | — |

Filter operators (for `filter`): `$eq $ne $gt $gte $lt $lte $in $nin $contains $ncontains
$startsWith $endsWith $empty`. Sort: `{"column": "asc"|"desc"}`.

**OUTPUTS** (vary by operation): `success` (bool), `row` (json: get/insert/upsert/update),
`operation` (string: upsert), `rows` (array: query/batch), `rowCount`/`totalCount`
(query), `insertedCount` (batch), `updatedCount`/`updatedRowIds` (update_by_filter),
`deletedCount`/`deletedRowIds` (delete), `name`/`columns` (get_schema), `message` (string).

## `knowledge` — Knowledge  (vector search / KB)

- **name:** Knowledge · **category:** blocks · **bgColor:** `#00B0B0` · **icon:** `PackageSearchIcon`
- **trigger?** no
- **bestPractices:** *Clarify which tags are available before using tag filters. Use List
  Documents to enumerate before operating; Get Document for full details (tags, connector
  metadata, status); List Chunks to inspect before updating/deleting chunks; List/Get
  Connector to check sync health.*

**COMMON SUBBLOCKS** (all operations): `operation` (dropdown, default `search`);
`knowledgeBaseSelector` (knowledge-base-selector, basic, req → canonical `knowledgeBaseId`);
`manualKnowledgeBaseId` (short-input, advanced, req → canonical `knowledgeBaseId`).

**OPERATIONS** (option id → tool → its extra fields):

| operation | tool | extra fields |
|---|---|---|
| `search` | `knowledge_search` | `query` (short-input), `topK` (short-input), `tagFilters` (knowledge-tag-filters), `rerankerEnabled` (switch), `rerankerModel` (dropdown ⟨pending model list⟩), `rerankerInputCount` (short-input), `apiKey` (Cohere key, self-host reranker only) |
| `list_documents` | `knowledge_list_documents` | `search`, `enabledFilter` (all/enabled/disabled), `limit`, `offset` |
| `get_document` | `knowledge_get_document` | `documentSelector`/`documentId` (basic/advanced → canonical `documentId`) |
| `create_document` | `knowledge_create_document` | `name` (**req**), `content` (long-input — **req**), `documentTags` |
| `upsert_document` | `knowledge_upsert_document` | `name` (**req**), `content` (**req**), `documentTags`, `upsertDocumentId` |
| `delete_document` | `knowledge_delete_document` | document selector |
| `list_chunks` | `knowledge_list_chunks` | document selector, `chunkSearch`, `chunkEnabledFilter`, `limit`, `offset` |
| `upload_chunk` | `knowledge_upload_chunk` | document selector, `content` (long-input — **req**) |
| `update_chunk` | `knowledge_update_chunk` | document selector, `chunkId` (**req**), `content`, `enabled` |
| `delete_chunk` | `knowledge_delete_chunk` | document selector, `chunkId` (**req**) |
| `list_tags` | `knowledge_list_tags` | — |
| `list_connectors` | `knowledge_list_connectors` | — |
| `get_connector` | `knowledge_get_connector` | `connectorId` (**req**) |
| `trigger_sync` | `knowledge_trigger_sync` | `connectorId` (**req**) |

Canonical runtime params: **`knowledgeBaseId`** and **`documentId`** (NOT `kbId`).
**OUTPUTS:** `results` (json), `query` (string), `totalResults` (number).

## `slack` — Slack

- **name:** Slack · **category:** tools · **bgColor:** `#611f69` · **icon:** `SlackIcon`
- **trigger?** YES · `triggers.available: ['slack_webhook']`
- **authType:** dual — OAuth ("Sim Bot") via `credential` (serviceId `slack`), OR Bot Token
  ("Custom Bot") via `botToken` (xoxb-…). Selected by `authMethod` dropdown (`oauth`/`bot_token`).
- **bestPractices:** none in registry.

**COMMON SUBBLOCKS:** `operation` (dropdown, default `send`); `authMethod` (dropdown,
`oauth`/`bot_token`, req); `credential` (oauth-input, serviceId `slack`, basic, when
oauth) / `manualCredential` (advanced) — canonical `oauthCredential`; `botToken`
(short-input password, when bot_token); `channel` (channel-selector, serviceId `slack`,
selectorKey `slack.channels`, basic) / `manualChannel` (advanced) — canonical `channel`
(shown for most ops; placeholder `Enter Slack channel ID (e.g., C1234567890)`).

**OPERATIONS** (39 total; id → tool). Most-used on screen:

| operation | tool | key extra fields |
|---|---|---|
| `send` | `slack_message` | `messageFormat` (text/blocks), `text` (long-input — **req** when text), `blocks` (code json, when blocks), `threadTs`, `attachmentFiles`/`files` |
| `ephemeral` | `slack_ephemeral_message` | `ephemeralUser`/`manualEphemeralUser` (req), `text`/`blocks`, `threadTs` |
| `read` | `slack_message_reader` | `limit`, `oldest` |
| `canvas` | `slack_canvas` | `title` (**req**), `content` (**req**) |
| `update` | `slack_update_message` | `updateTimestamp` (**req**), `updateText`/`blocks` |
| `delete` | `slack_delete_message` | `deleteTimestamp` (**req**) |
| `react` / `unreact` | `slack_add_reaction` / `slack_remove_reaction` | `reactionTimestamp` (**req**), `emojiName` (**req**) |
| `list_channels` | `slack_list_channels` | `includePrivate`, `channelLimit` |
| `get_user` | `slack_get_user` | `userId`/`manualUserId` (**req**) |

> Full operation set (each → `slack_*` tool of the same stem): `send ephemeral canvas read
> get_message get_thread get_thread_replies get_channel_history get_permalink set_status
> set_title set_suggested_prompts list_channels list_members list_users get_user download
> update delete react unreact get_channel_info get_user_presence edit_canvas
> create_channel_canvas get_canvas list_canvases lookup_canvas_sections delete_canvas
> create_conversation invite_to_conversation open_view update_view push_view publish_view`.
> For DMs, set `destinationType: 'dm'` and fill `dmUserId`. Selector keys: `slack.channels`,
> `slack.users`. (Full per-field detail for the rarer ops is in slack.ts.)

**OUTPUTS** (vary by op): `message` (json), `ts` (string), `channel` (string), `files`
(file[]), `permalink`, `channels`/`members`/`users`/`user` (json lists), plus trigger
outputs (`event_type`, `channel_name`, `user_name`, `timestamp`, …). Read e.g. `<slack1.ts>`.

## `gmail_v2` — Gmail  (legacy block: `gmail` = "Gmail (Legacy)", hidden)

- **name:** Gmail · **category:** tools · **bgColor:** `#FFFFFF` · **icon:** `GmailIcon`
- **trigger?** YES · `triggers.available: ['gmail_poller']`
- **authType:** OAuth (serviceId `gmail`), + optional service-account impersonation
  (`impersonateUserEmail`).
- **bestPractices:** none in registry. (Note: copilot tool descriptions append a "sent
  with sim ai" footer note to `gmail_send_v2`.)

**COMMON SUBBLOCKS:** `operation` (dropdown, default `send_gmail`); `credential`
(oauth-input, serviceId `gmail`, basic) / `manualCredential` (advanced) — canonical
`oauthCredential`; `impersonateUserEmail` (short-input, service accounts).

**OPERATIONS** (option id → tool `gmail_*_v2`):

| operation | tool | key extra fields |
|---|---|---|
| `send_gmail` | `gmail_send_v2` | `to` (**req**), `subject`, `body` (**req**), `contentType` (text/html), `attachmentFiles`/`attachments`, `threadId`, `replyToMessageId`, `cc`, `bcc` |
| `read_gmail` | `gmail_read_v2` | `folder`/`manualFolder` (label), `unreadOnly`, `includeAttachments`, `messageId`, `maxResults` |
| `draft_gmail` | `gmail_draft_v2` | same compose group as send |
| `edit_draft_gmail` | `gmail_edit_draft_v2` | `draftId` (**req**) + compose group |
| `search_gmail` | `gmail_search_v2` | `query` (**req**), `maxResults` |
| `move_gmail` | `gmail_move_v2` | `moveMessageId` (**req**), `destinationLabel`/`manualDestinationLabel` (**req**), `sourceLabel`/`manualSourceLabel` |
| `mark_read_gmail`/`mark_unread_gmail`/`archive_gmail`/`unarchive_gmail`/`delete_gmail` | `gmail_*_v2` | `actionMessageId` (**req**) |
| `add_label_gmail`/`remove_label_gmail` | `gmail_add_label_v2`/`gmail_remove_label_v2` | `labelActionMessageId` (**req**), `labelSelector`/`manualLabelId` (**req**) |

Label folder-selectors use selectorKey `gmail.labels`.
**OUTPUTS (v2):** `id` (string), `threadId` (string), `labelIds` (array), `from`, `to`,
`subject`, `date`, `body`, `results` (json), `attachments` (file[]), `draftId`/`messageId`
(draft ops), plus trigger outputs (`email_id`, `thread_id`, `body_text`, `labels`, …).

## `exa` — Exa  (AI search)

- **name:** Exa · **category:** tools · **bgColor:** `#1F40ED` · **icon:** `ExaAIIcon`
- **trigger?** no · **authType:** API Key (`apiKey`, password; hosted key available except for research)
- **bestPractices:** none in registry.

**OPERATIONS** (option id → tool of same id; default `exa_search`):

| operation | tool | key extra fields |
|---|---|---|
| `exa_search` | `exa_search` | `query` (long-input — **req**), `numResults`, `type` (auto/neural/keyword/fast), `includeDomains`, `excludeDomains`, `category`, `text`, `highlights`, `summary`, `livecrawl`, date filters |
| `exa_get_contents` | `exa_get_contents` | `urls` (**req**), `text`, `summaryQuery`, `subpages`, `subpageTarget`, `highlights` |
| `exa_find_similar_links` | `exa_find_similar_links` | `url` (**req**), `numResults`, `text`, domain filters, `category`, `highlights`, `summary`, `livecrawl` |
| `exa_answer` | `exa_answer` | `query` (**req**), `text` |
| `exa_research` | `exa_research` | `query` (**req**), `model` (`exa-research`/`exa-research-fast`/`exa-research-pro`) |

**OUTPUTS:** `results` (json), `similarLinks` (json), `answer` (string), `citations`
(json), `research` (json).

## `firecrawl` — Firecrawl  (scrape / crawl / extract)

- **name:** Firecrawl · **category:** tools · **bgColor:** `#181C1E` · **icon:** `FirecrawlIcon`
- **trigger?** no · **authType:** API Key (`apiKey`, password; hosted key available except for agent)
- **bestPractices:** none in registry.

**OPERATIONS** (option id → tool `firecrawl_*`; default `scrape`):

| operation | tool | key extra fields |
|---|---|---|
| `scrape` | `firecrawl_scrape` | `url` (**req**), `onlyMainContent`, `formats`, `waitFor`, `mobile`, `timeout` |
| `search` | `firecrawl_search` | `query` (**req**), `limit`, `timeout` |
| `crawl` | `firecrawl_crawl` | `url` (**req**), `limit` |
| `map` | `firecrawl_map` | `url` (**req**), `limit` |
| `extract` | `firecrawl_extract` | `urls` (**req**), `prompt` |
| `agent` | `firecrawl_agent` | `agentPrompt` (**req**), `agentUrls`, `schema` (code json), `maxCredits`, `strictConstrainToURLs` |
| `parse` | `firecrawl_parse` | `fileUpload`/`fileReference` (**req**), `formats`, `onlyMainContent`, parser opts |

**OUTPUTS:** `markdown` (string), `html` (string), `metadata` (json), `data` (json),
`pages` (json), `total` (number), `success` (bool), `links` (json), `sources` (json),
`status` (string), `summary` (string), `screenshot` (string).

---

## Reading the data downstream — the `<block.field>` rule

Downstream blocks reference an upstream block's output by the upstream block's **name**
(slugified) and the output **field**: `<agent1.content>`, `<api1.data>`, `<table1.rows>`,
`<webhook1.message>`, `<webhook1.data.key>` (dot-notation into nested payloads),
`<start.input>`, `<loop.index>` / `<loop.currentItem>` (inside a loop),
`<parallel.currentItem>` (inside a parallel). The fields you may reference are exactly the
OUTPUTS listed per block above — plus, for the Agent block with a `responseFormat`, the
top-level properties of that schema (read at root, e.g. `<agent1.myField>`).
