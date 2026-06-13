import {CAM_HOME, CAM_OUT, CAM_PANEL1, CAM_WORK} from "../layout";
import type {StageState} from "./_rig";

// Phase-A static end-state presets, one per locked scene (static-frames-
// first workflow). Each preset is the state the scene SETTLES into, so the
// boundary contract holds by construction; Phase B animates within each
// scene toward these states. Exception (declared in script-v1.md): scene 6's
// Phase-A frame is its MID-state — the money shot (row 1 landed, lane 2
// stamping, lane 3 still live); its true exit state equals scene 7's enter.

/** 1 · the-workflow — the clean chain, assembled, at rest. */
export const S1_THE_WORKFLOW: StageState = {
	cam: CAM_WORK,
};

/** 2 · the-run-fires — run live, the fan out (runtime-only ghosts). */
export const S2_THE_RUN_FIRES: StageState = {
	cam: CAM_HOME,
	campaign: {highlighted: true},
	container: {highlighted: true},
	call: {highlighted: true},
	edge1: {hi: 1},
	edge2: {hi: 1},
	pillE: {hi: 1},
	fan: 1,
	tagGlow: 1,
};

/** 3 · calls-connect — three aside panels born; the empty record appears. */
export const S3_CALLS_CONNECT: StageState = {
	...S2_THE_RUN_FIRES,
	tagGlow: 0,
	panels: [
		{visible: 1, turnCount: 1, speaking: 1},
		{visible: 1, turnCount: 1, speaking: 0.85},
		{visible: 1, turnCount: 1, speaking: 0.7},
	],
	tableReveal: 1,
};

/** 4 · one-conversation — lean into panel 1; the turn loop. */
export const S4_ONE_CONVERSATION: StageState = {
	...S3_CALLS_CONNECT,
	cam: CAM_PANEL1,
	workflowDim: 1,
	panels: [
		{visible: 1, turnCount: 3, speaking: 1},
		{visible: 1, turnCount: 1, speaking: 0, dim: 1},
		{visible: 1, turnCount: 1, speaking: 0.6, dim: 1},
	],
};

/** 5 · three-at-once — pull back; all three streaming, de-phased. */
export const S5_THREE_AT_ONCE: StageState = {
	...S3_CALLS_CONNECT,
	cam: CAM_HOME,
	panels: [
		{visible: 1, turnCount: 3, speaking: 1},
		{visible: 1, turnCount: 2, speaking: 0}, // listening — human bars rising
		{visible: 1, turnCount: 2, lastReveal: 1, speaking: 0.9},
	],
};

/** 6 · outcomes-land (Phase-A frame = MID-state, THE MONEY SHOT):
 *  call 1 resolved → row 1 landed; call 2 stamping → row 2 landing;
 *  call 3 still live. Log outcome blips in sync. */
export const S6_OUTCOMES_LAND: StageState = {
	...S5_THREE_AT_ONCE,
	log: {highlighted: true},
	panels: [
		{visible: 1, turnCount: 3, speaking: 0, ended: true, outcomeReveal: 1},
		{visible: 1, turnCount: 3, speaking: 0, ended: true, outcomeReveal: 0.85},
		{visible: 1, turnCount: 2, speaking: 1},
	],
	rowReveal: [1, 0.85, 0],
};

/** 7 · the-campaign-ran — the settled bookend: clean chain (fan retracted,
 *  rings released), quiet stamped panels, the table full. */
export const S7_THE_CAMPAIGN_RAN: StageState = {
	cam: CAM_OUT,
	fan: 0,
	panels: [
		{visible: 1, turnCount: 3, speaking: 0, ended: true, outcomeReveal: 1},
		{visible: 1, turnCount: 3, speaking: 0, ended: true, outcomeReveal: 1},
		{visible: 1, turnCount: 3, speaking: 0, ended: true, outcomeReveal: 1},
	],
	tableReveal: 1,
	rowReveal: [1, 1, 1],
};
