// Shared layout for the Module 7 — Logs & Debugging video.
//
// The spine is a RunTimeline: a horizontal sequence of run blocks. It appears in
// run-is-a-timeline, gets inspected in block-anatomy, and returns in
// dont-guess-trace and data-stopped-matching. Adjacent scenes read the SAME
// constants so the timeline never teleports between cuts.

import type {ObjectKind} from "../../components";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// ── RunTimeline geometry ────────────────────────────────────────────────────
// Five blocks, left-to-right, centered. Each block is a small ObjectNode-style
// tile with a status badge. The last block is the failed one.
export const RUN_BLOCK_W = 240;
export const RUN_BLOCK_H = 150;
export const RUN_GAP = 96; // gap = room for connector + arrow
export const RUN_COUNT = 5;

const RUN_ROW_W = RUN_COUNT * RUN_BLOCK_W + (RUN_COUNT - 1) * RUN_GAP;
export const RUN_X = (STAGE_W - RUN_ROW_W) / 2;
// Vertical center for the timeline when it sits alone on stage.
export const RUN_Y = (STAGE_H - RUN_BLOCK_H) / 2;

export const runBlockX = (i: number) => RUN_X + i * (RUN_BLOCK_W + RUN_GAP);
export const runBlockCenterX = (i: number) => runBlockX(i) + RUN_BLOCK_W / 2;

// Per-block identity: what kind of step it is + its label.
export type RunStep = {kind: ObjectKind; label: string};
export const RUN_STEPS: RunStep[] = [
	{kind: "tool", label: "Fetch"},
	{kind: "agent", label: "Extract"},
	{kind: "tool", label: "Lookup"},
	{kind: "agent", label: "Compose"},
	{kind: "tool", label: "Send"},
];

// The block that fails (last in the run).
export const FAILED_INDEX = 4;
// The upstream block where the data actually went wrong (the root cause).
export const ROOT_CAUSE_INDEX = 2;

// ── BlockInspector panel (block-anatomy) ────────────────────────────────────
// The failed block lifts to the left; the inspector slides in on the right.
export const INSPECT_BLOCK_X = 220;
export const INSPECT_BLOCK_Y = 560;
export const INSPECT_BLOCK_W = 300;
export const INSPECT_BLOCK_H = 190;

export const INSPECT_PANEL_X = 660;
export const INSPECT_PANEL_Y = 300;
export const INSPECT_PANEL_W = 1040;
export const INSPECT_PANEL_H = 540;
