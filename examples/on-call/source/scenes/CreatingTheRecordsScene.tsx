import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_READ, camLerp} from "../layout";
import {FOLLOWED_ROW} from "../data";
import {FLIP_NONE, flipAt, ramp} from "./_beats";
import {Stage} from "./_rig";

// Scene 5 — creating the records. [run 1 completes — THE MONEY SHOT]
// Camera back at CAM_ALL. The Triage ring settles ok; content and tokens
// reveal in the record tree; three pulses leave the agent together. Slack
// goes live → ok and its log row lands; row 3's status dips firing →
// triaged with the green tint. Linear goes live → ok, log row lands.
// PagerDuty goes live → ok, log row lands — and row 3 dips triaged →
// assigned, tint pulsing to residue. Record full; the Messages reference
// reverts to its tag as run 1 settles.
// Beat intent: it posts the diagnosis to Slack, opens the Linear ticket,
// and pages the on-call with context — three records, created, and the
// incident is assigned.
export const CreatingTheRecordsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camLerp(CAM_READ, CAM_ALL, ramp(t, 0.2, 1.6, 0, 1, EASING.inOut));

	// The agent settles ok; its outputs land in the tree.
	const agentLive = t < 2.2;
	const content = ramp(t, 2.3, 2.8);
	const tokens = ramp(t, 2.6, 3.1);

	// Three pulses leave the agent's source handle together.
	const fanP = ramp(t, 3.4, 4.2);

	// Slack → Linear → PagerDuty: live → ok as the narration names each,
	// each log row landing as the record is written; the fan edges carry
	// the highlight while live.
	const OK = [5.4, 8.0, 10.6];
	const live = (i: number) => t >= OK[i] - 0.9 && t < OK[i];
	const ok = (i: number) => t >= OK[i];
	const log = (i: number) => ramp(t, OK[i], OK[i] + 0.4);
	const fanHi = (i: number) => Math.min(ramp(t, 3.4, 3.8), ramp(t, OK[i], OK[i] + 0.7, 1, 0));

	// Row 3 flips in sync with the run's REAL records: triaged when the
	// Slack post lands (the agent's summary exists), assigned when the
	// PagerDuty incident is created.
	const flip = flipAt(t, 5.5, 10.7);

	// Run 1 settles — the Messages reference reverts to its tag (template
	// state carries across 5→6).
	const resolve = ramp(t, 13.4, 13.9, 1, 0);

	return (
		<Stage
			cam={cam}
			webhook={{state: "ok"}}
			agent={{highlighted: agentLive, state: agentLive ? "none" : "ok"}}
			terms={[
				{highlighted: live(0), state: ok(0) ? "ok" : "none"},
				{highlighted: live(1), state: ok(1) ? "ok" : "none"},
				{highlighted: live(2), state: ok(2) ? "ok" : "none"},
			]}
			fans={[{hi: fanHi(0)}, {hi: fanHi(1)}, {hi: fanHi(2)}]}
			fanPulses={[fanP, fanP, fanP]}
			msgTag={{resolve}}
			statusAt={(r) => (r === FOLLOWED_ROW ? flip.status : FLIP_NONE.status)}
			statusTextOp={(r) => (r === FOLLOWED_ROW ? flip.textOp : 1)}
			statusTint={(r) => (r === FOLLOWED_ROW ? flip.tint : 0)}
			recordIn={1}
			logReveals={[1, 1, log(0), log(1), log(2)]}
			logSelected={1}
			contentReveal={content}
			tokensReveal={tokens}
		/>
	);
};
