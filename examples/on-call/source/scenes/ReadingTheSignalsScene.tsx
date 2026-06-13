import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_READ, camLerp} from "../layout";
import {ramp} from "./_beats";
import {Stage} from "./_rig";

// Scene 4 — reading the signals. [zoom-aside beats, same run] Camera leans
// toward the agent + record (CAM_READ). Three read beats, each carried by
// SYNCHRONY ONLY: the Sentry chip rings ↔ [0] sentry_issues_get lands in
// the record's toolCalls; Datadog ↔ [1] datadog_query_logs; GitHub ↔ [2]
// github_latest_commit. The Triage log row's duration counts up; the agent
// ring stays live. HOLDS through the cut.
// Beat intent: the agent reads the incident the way an engineer would —
// the Sentry issue, the logs around it, the commit that shipped — and
// every call lands in the run record as it happens.
export const ReadingTheSignalsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camLerp(CAM_ALL, CAM_READ, ramp(t, 0.3, 1.7, 0, 1, EASING.inOut));

	// Triage's own log row lands (selected — the tree is ITS output) and its
	// duration counts up while the agent works, landing exactly on 9.8s.
	const triageRow = ramp(t, 0.8, 1.2);
	const triageDur = `${(9.8 * ramp(t, 1.2, 12.5)).toFixed(1)}s`;

	// The three read beats, paced to the narration naming each system:
	// chip ring ↔ toolCalls row, in sync.
	const B = [4.5, 7.5, 10.5];
	const ring = (b: number) => Math.min(ramp(t, b - 0.5, b - 0.2), ramp(t, b + 0.8, b + 1.5, 1, 0));
	const land = (b: number) => ramp(t, b, b + 0.4);
	const hi = (b: number) => Math.min(ramp(t, b, b + 0.3), ramp(t, b + 0.7, b + 1.5, 1, 0));

	return (
		<Stage
			cam={cam}
			webhook={{state: "ok"}}
			agent={{highlighted: true}}
			toolRings={[ring(B[0]), ring(B[1]), ring(B[2])]}
			msgTag={{resolve: 1}}
			recordIn={1}
			logReveals={[1, triageRow, 0, 0, 0]}
			logSelected={1}
			triageDur={triageDur}
			contentReveal={0}
			tokensReveal={0}
			toolCallReveals={[land(B[0]), land(B[1]), land(B[2])]}
			toolCallHi={[hi(B[0]), hi(B[1]), hi(B[2])]}
		/>
	);
};
