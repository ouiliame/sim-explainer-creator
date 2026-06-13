import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, type LaneId} from "../layout";
import {Stage, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 6 — the-scramble-finish [the parallel resolves]. The other lanes
// finish in scramble order — each triplet works through (pulse → live →
// ok) at its own beat; result order isn't guaranteed (parallel.mdx),
// drawn. Then the fan folds back to one lane, the active path cools, and
// the container settles ok. The table is still empty — nothing has
// written yet.
// Exit: fan folded, container ok, chain settled except the Table block
// idle, table empty, CAM_ALL.

const NONE = () => 0;

// Ghost finish order (scramble — not top-to-bottom) and start beats.
const FINISH: Array<{lane: LaneId; f: number}> = [
	{lane: 3, f: 0.4},
	{lane: 0, f: 1.75},
	{lane: 4, f: 3.1},
	{lane: 1, f: 4.45},
];

export const TheScrambleFinishScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Fan folds back after the last lane lands; the container settles ok.
	const fan = 1 - ramp(t, 6.7, 8.0, EASING.inOut);
	const contOk = t >= 8.3;
	const edge1Hi = 1 - ramp(t, 7.5, 8.3);

	const ghostLane = (lane: LaneId, f: number): LaneState => ({
		enr: {highlighted: t < f, state: t >= f ? "ok" : "none"},
		pers: {highlighted: t >= f + 0.45 && t < f + 0.95, state: t >= f + 0.95 ? "ok" : "none"},
		send: {highlighted: t >= f + 1.45 && t < f + 1.95, state: t >= f + 1.95 ? "ok" : "none"},
		edgeIn: {hi: 1 - ramp(t, f, f + 0.7)},
		edgeA: {hi: pulseWindow(t, f + 0.45, f + 0.65, f + 0.95, f + 1.25)},
		edgeB: {hi: pulseWindow(t, f + 1.45, f + 1.65, f + 1.95, f + 2.25)},
		pulseA: ramp(t, f + 0.45, f + 1.0, EASING.inOut),
		pulseB: ramp(t, f + 1.45, f + 2.0, EASING.inOut),
	});

	const lanes: Partial<Record<LaneId, LaneState>> = {
		2: {enr: {state: "ok"}, pers: {state: "ok"}, send: {state: "ok"}},
	};
	FINISH.forEach(({lane, f}) => (lanes[lane] = ghostLane(lane, f)));

	return (
		<Stage
			cam={CAM_ALL}
			rowLand={NONE}
			apollo={{state: "ok"}}
			edge1={{hi: edge1Hi}}
			cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}
			fan={fan}
			lanes={lanes}
			itemTag={{resolve: 1}}
			contactTag={{resolve: 1}}
		/>
	);
};
