import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_CONT, CAM_LANE, type LaneId} from "../layout";
import {FOLLOWED_ROW} from "../data";
import {Stage, camMix, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 7 — one-analyst [camera lean-in, same run]. Opens inside the
// held moment; the camera pushes onto the followed lane. The Analyst
// works — the Exa chip rings (search), then the Perplexity chip rings
// (cross-check) — and settles ok. Pulse → Update Board goes live, and
// the camera eases back out to the full frame just in time to see the
// lane close its own loop: row 4's agent_est dips in 0.71, edge fills
// 0.16, signal flags `watch` — a green pulse decaying to the provenance
// residue (the signal cell keeps it strong). The reference reverts as
// the lane finishes.
// Exit (freeze-cut): fan 1, followed lane ok, row 4 filled + residue,
// tag reverted, four ghost Analysts still live, container live, CAM_ALL.
export const OneAnalystScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera: container → lane → full frame (each move EASING.inOut) —
	// the tool calls play at lane framing, the row fill lands after the
	// ease back out.
	const inMix = ramp(t, 0.5, 1.8, EASING.inOut);
	const outMix = ramp(t, 8.4, 9.8, EASING.inOut);
	const cam =
		t < 8.4 ? camMix(CAM_CONT, CAM_LANE, inMix) : camMix(CAM_LANE, CAM_ALL, outMix);

	// The agent's two tool calls — chip ring pulses (search, cross-check).
	const exaRing = pulseWindow(t, 2.4, 2.7, 3.5, 3.8);
	const pplxRing = pulseWindow(t, 4.4, 4.7, 5.5, 5.8);

	const anaLive = t < 6.4;
	const anaOk = t >= 6.4;

	const pulseA = ramp(t, 6.6, 7.2, EASING.inOut);
	const edgeAHi = pulseWindow(t, 6.6, 7.0, 8.2, 8.7);
	const updLive = t >= 7.1 && t < 9.9;
	const updOk = t >= 9.9;

	// The lane's row closes its loop (visible at the eased-out framing).
	const fill = ramp(t, 10.0, 10.6);
	const tint = fill * (1 - 0.65 * ramp(t, 11.2, 11.8));
	const signal = ramp(t, 10.2, 10.8);

	// The reference reverts as the lane finishes its work.
	const tagResolve = 1 - ramp(t, 10.6, 11.1);

	const ghostLane = (): LaneState => ({ana: {highlighted: true}});
	const ghosts: Partial<Record<LaneId, LaneState>> = {
		0: ghostLane(),
		1: ghostLane(),
		3: ghostLane(),
		4: ghostLane(),
	};

	return (
		<Stage
			cam={cam}
			fan={1}
			cont={{highlighted: true}}
			pill={{reveal: 1, swap: 1}}
			fillMix={(r) => (r === FOLLOWED_ROW ? fill : 0)}
			fillTint={(r) => (r === FOLLOWED_ROW ? tint : 0)}
			signalTint={(r) => (r === FOLLOWED_ROW ? signal : 0)}
			laneTag={{glow: 0, resolve: tagResolve}}
			lanes={{
				...ghosts,
				2: {
					exaRing,
					pplxRing,
					ana: {highlighted: anaLive, state: anaOk ? "ok" : "none"},
					upd: {highlighted: updLive, state: updOk ? "ok" : "none"},
					edgeA: {hi: edgeAHi},
					pulseA,
				},
			}}
		/>
	);
};
