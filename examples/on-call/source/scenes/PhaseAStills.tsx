import React from "react";
import {CAM_ALL} from "../layout";
import {FOLLOWED_ROW} from "../data";
import {Stage} from "./_rig";

// PHASE A static states (script-v1.md). Both are coherent instants of the
// locked choreography so they survive into Phase B as keyframes.

// ── The money instant (mid scene 5: run 1 completing) ───────────────────────
// The webhook and the agent have settled ok; the GitHub chip's ring is still
// decaying from the last read; Slack has landed (ok, its log row in the
// record, row 3 flipped `triaged` with the tint pulsing); Linear and
// PagerDuty are live (blue) with their log rows not yet written; the
// Messages reference is still resolved to run 1's alert. Other rows: firing.
export const MoneyShotStill: React.FC = () => (
	<Stage
		cam={CAM_ALL}
		webhook={{state: "ok"}}
		agent={{state: "ok"}}
		terms={[{state: "ok"}, {highlighted: true}, {highlighted: true}]}
		edge1={{}}
		fans={[{hi: 0.55}, {hi: 1}, {hi: 1}]}
		toolRings={[0, 0, 0.55]}
		msgTag={{glow: 0.3, resolve: 1}}
		statusAt={(r) => (r === FOLLOWED_ROW ? "triaged" : "firing")}
		statusTint={(r) => (r === FOLLOWED_ROW ? 0.85 : 0)}
		recordIn={1}
		logReveals={[1, 1, 1, 0, 0]}
		logSelected={1}
		contentReveal={1}
		tokensReveal={1}
		toolCallReveals={[1, 1, 1]}
	/>
);

// ── The final frame (scene 7: morning) ──────────────────────────────────────
// Chain settled green in causal order, record full (run 1's record,
// Triage selected), every status cell `assigned` with its faint residue.
// Template state otherwise: the Messages reference is back to its tag.
export const FinalSetPieceStill: React.FC = () => (
	<Stage
		cam={CAM_ALL}
		webhook={{state: "ok"}}
		agent={{state: "ok"}}
		terms={[{state: "ok"}, {state: "ok"}, {state: "ok"}]}
		statusAt={() => "assigned"}
		statusTint={() => 0.35}
		recordIn={1}
		logReveals={[1, 1, 1, 1, 1]}
		logSelected={1}
	/>
);
