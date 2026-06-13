import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_TABLE, camLerp} from "../layout";
import {ramp} from "./_beats";
import {Stage} from "./_rig";

// Scene 2 — the responder. [assemble + camera ease] Camera eases out from
// the table to CAM_ALL; the workflow assembles left of the rail in flow
// order: Sentry Alerts webhook → edge → Triage agent (rows, then the three
// tool chips width-grow in: Sentry, Datadog, GitHub) → three edges draw to
// Slack, Linear, PagerDuty.
// Beat intent: this is the on-call agent — a webhook receives each alert,
// an agent reads the monitoring stack, and three integrations carry its
// findings out.
export const TheResponderScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Paced to the narrated beats: the camera settles while the thesis line
	// plays, then each part assembles as it is named.
	const cam = camLerp(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.5, 0, 1, EASING.inOut));

	const webhookIn = ramp(t, 4.4, 5.0, 0, 1, EASING.out);
	const edge1 = ramp(t, 6.2, 6.8, 0, 1, EASING.out);
	const agentIn = ramp(t, 7.4, 8.0, 0, 1, EASING.out);

	// The Tools line grows in, then the chips width-grow one by one as the
	// narration names them; the second chip line opens as GitHub wraps onto
	// it (no height pop).
	const toolsRow = ramp(t, 10.2, 10.7, 0, 1, EASING.out);
	const chips: [number, number, number] = [
		ramp(t, 10.8, 11.25, 0, 1, EASING.out),
		ramp(t, 11.7, 12.15, 0, 1, EASING.out),
		ramp(t, 12.6, 13.05, 0, 1, EASING.out),
	];
	const toolsWrap = ramp(t, 12.55, 13.0, 0, 1, EASING.out);

	// Three real edges fan from the agent's source handle; each terminal
	// fades in as its edge lands.
	const fans: [number, number, number] = [
		ramp(t, 14.8, 15.4, 0, 1, EASING.out),
		ramp(t, 15.7, 16.3, 0, 1, EASING.out),
		ramp(t, 16.6, 17.2, 0, 1, EASING.out),
	];
	const terms: [number, number, number] = [
		ramp(t, 15.5, 16.1, 0, 1, EASING.out),
		ramp(t, 16.4, 17.0, 0, 1, EASING.out),
		ramp(t, 17.3, 17.9, 0, 1, EASING.out),
	];

	return (
		<Stage
			cam={cam}
			webhook={{opacity: webhookIn}}
			agent={{opacity: agentIn}}
			terms={[{opacity: terms[0]}, {opacity: terms[1]}, {opacity: terms[2]}]}
			edge1={{progress: edge1}}
			fans={[{progress: fans[0]}, {progress: fans[1]}, {progress: fans[2]}]}
			toolsRowReveal={toolsRow}
			toolChipReveals={chips}
			toolsWrapReveal={toolsWrap}
		/>
	);
};
