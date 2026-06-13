import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_CONT, CAM_LANE, type LaneId} from "../layout";
import {Stage, camMix, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 7 — one-engineer [camera lean-in, same run]. Opens inside the
// held moment; the camera pushes onto the followed lane. The Engineer
// works — the GitHub tool chip rings three quick times (reading the
// file, writing the fix, pushing the branch) — and settles ok. Pulse →
// the GitHub block goes live and settles ok (the PR exists). Pulse →
// Mark Done goes live, and the camera eases back out to the full frame
// just in time to see the lane close its own loop: row 3 flips (done /
// #482) with a green pulse that decays to the provenance residue.
// Exit (freeze-cut): fan 1, followed lane ok, row 3 flipped + residue,
// four ghost Engineers still live, container live, CAM_ALL.
export const OneEngineerScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera: container → lane → full frame (each move EASING.inOut),
	// paced to the narration: the tool calls play at lane framing, the row
	// flip lands after the ease back out.
	const inMix = ramp(t, 0.5, 1.8, EASING.inOut);
	const outMix = ramp(t, 12.6, 14.2, EASING.inOut);
	const cam =
		t < 12.6 ? camMix(CAM_CONT, CAM_LANE, inMix) : camMix(CAM_LANE, CAM_ALL, outMix);

	// The agent's three tool calls — chip ring pulses (read, fix, branch).
	const chipRing = Math.max(
		pulseWindow(t, 3.2, 3.5, 4.2, 4.5),
		pulseWindow(t, 5.2, 5.5, 6.2, 6.5),
		pulseWindow(t, 7.2, 7.5, 8.2, 8.5),
	);

	const engLive = t < 9.4;
	const engOk = t >= 9.4;

	const pulseA = ramp(t, 9.6, 10.2, EASING.inOut);
	const edgeAHi = pulseWindow(t, 9.6, 10.0, 11.4, 11.9);
	const ghLive = t >= 10.1 && t < 12.2;
	const ghOk = t >= 12.2;

	const pulseB = ramp(t, 13.4, 14.0, EASING.inOut);
	const edgeBHi = pulseWindow(t, 13.4, 13.8, 15.2, 15.7);
	const mdLive = t >= 13.9 && t < 16.0;
	const mdOk = t >= 16.0;

	// The lane's row closes its loop (visible at the eased-out framing).
	const flip = ramp(t, 16.2, 16.8);
	const tint =
		ramp(t, 16.2, 16.8) * (1 - 0.65 * ramp(t, 17.6, 18.8));

	// The reference reverts as the lane finishes its work.
	const tagResolve = 1 - ramp(t, 16.8, 17.3);

	const ghostLane = (): LaneState => ({eng: {highlighted: true}});
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
			flipMix={(r) => (r === 2 ? flip : 0)}
			flipTint={(r) => (r === 2 ? tint : 0)}
			laneTag={{glow: 0, resolve: tagResolve}}
			lanes={{
				...ghosts,
				2: {
					chipRing,
					eng: {highlighted: engLive, state: engOk ? "ok" : "none"},
					gh: {highlighted: ghLive, state: ghOk ? "ok" : "none"},
					md: {highlighted: mdLive, state: mdOk ? "ok" : "none"},
					edgeA: {hi: edgeAHi},
					edgeB: {hi: edgeBHi},
					pulseA,
					pulseB,
				},
			}}
		/>
	);
};
