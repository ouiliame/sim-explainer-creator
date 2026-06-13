import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_ALL} from "../layout";
import {FOLLOWED_ROW} from "../data";
import {pulse, ramp} from "./_beats";
import {Stage} from "./_rig";

// Scene 3 — alert in. [run 1 starts, freeze-cut] The first alert arrives:
// the webhook blips live and settles ok; <sentryalerts.message> resolves in
// the Triage Messages row while row 3 of the table takes the product
// selection highlight IN SYNC (the alert ↔ its row, synchrony only); a
// pulse crosses edge 1; the Triage live ring comes ON. The run record fades
// in below the table with its first log row landed (Sentry Alerts · 18ms).
// HOLDS through the cut.
// Beat intent: one alert in — the run has begun, and the record is already
// being written.
export const AlertInScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The webhook blips live, then settles ok (it ran in 18ms).
	const webhookLive = t >= 1.2 && t < 1.9;
	const webhookOk = t >= 1.9;

	// The payload reference resolves the moment the event lands — and the
	// table row it came from takes the selection treatment IN SYNC ("row
	// three, the 500s on the payments API").
	const glow = pulse(t, 1.5, 2.3, 0.3, 0.4);
	const resolve = ramp(t, 1.95, 2.45);
	const rowHi = pulse(t, 1.95, 4.2, 0.35, 0.6);

	// "The webhook hands the message to the agent."
	const p1 = ramp(t, 6.5, 7.2);
	const agentLive = t >= 7.15;

	// "Sim starts recording the run."
	const recordIn = ramp(t, 10.0, 10.7);
	const log0 = ramp(t, 10.5, 10.9);

	return (
		<Stage
			cam={CAM_ALL}
			webhook={{highlighted: webhookLive, state: webhookOk ? "ok" : "none"}}
			agent={{highlighted: agentLive}}
			msgTag={{glow, resolve}}
			pulse1={p1}
			rowHi={(r) => (r === FOLLOWED_ROW ? rowHi : 0)}
			recordIn={recordIn}
			logReveals={[log0, 0, 0, 0, 0]}
			logSelected={-1}
			contentReveal={0}
			tokensReveal={0}
			toolCallReveals={[0, 0, 0]}
		/>
	);
};
