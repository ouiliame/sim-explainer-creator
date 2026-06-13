import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, type LaneId} from "../layout";
import {GHOST_FINISH_ORDER} from "../data";
import {Stage, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 8 — the-wall [the money shot]. Full frame, steady camera. The
// remaining four lanes finish in scramble order (parallel result order
// isn't guaranteed — the docs' sentence, drawn): each finish is a lane
// triplet settling ok and IN SYNC its table row flipping — status dips
// open → done, the pr cell fills, a green pulse decays to the residue.
// The status column becomes the wall. Then the fan folds back into one
// lane, the container settles ok, and the chain settles green in causal
// order. Exit: fan 0, chain green, all rows flipped + residue, CAM_ALL.

// Per-lane finish start times, in GHOST_FINISH_ORDER (rows 4, 0, 3, 1) —
// cadenced so the row flips land under "row after row" in the narration.
const FINISH_AT: Partial<Record<LaneId, number>> = {};
GHOST_FINISH_ORDER.forEach((lane, i) => {
	FINISH_AT[lane as LaneId] = 0.8 + i * 1.5;
});

export const TheWallScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const fan = 1 - ramp(t, 10.4, 11.6, EASING.inOut);

	// Chain settles green in causal order after the work is done.
	const schedOk = t >= 11.9;
	const queryOk = t >= 12.3;
	const contOk = t >= 12.7;

	const ghostLane = (lane: LaneId): LaneState => {
		const f = FINISH_AT[lane]!;
		return {
			eng: {highlighted: t < f, state: t >= f ? "ok" : "none"},
			gh: {highlighted: t >= f + 0.3 && t < f + 0.45, state: t >= f + 0.45 ? "ok" : "none"},
			md: {highlighted: t >= f + 0.75 && t < f + 0.9, state: t >= f + 0.9 ? "ok" : "none"},
			edgeA: {hi: pulseWindow(t, f, f + 0.2, f + 0.6, f + 0.9)},
			edgeB: {hi: pulseWindow(t, f + 0.45, f + 0.65, f + 1.0, f + 1.3)},
			pulseA: ramp(t, f, f + 0.35, EASING.inOut),
			pulseB: ramp(t, f + 0.45, f + 0.8, EASING.inOut),
		};
	};

	// Row flips: row 2 done since scene 7 (held residue); ghost rows flip
	// at their lane's finish, pulse, and decay to the same residue.
	const flipMix = (r: number) => {
		if (r === 2) return 1;
		const f = FINISH_AT[r as LaneId];
		return f === undefined ? 0 : ramp(t, f + 0.95, f + 1.45);
	};
	const flipTint = (r: number) => {
		if (r === 2) return 0.35;
		const f = FINISH_AT[r as LaneId];
		if (f === undefined) return 0;
		return ramp(t, f + 0.95, f + 1.45) * (1 - 0.65 * ramp(t, f + 2.0, f + 3.0));
	};

	return (
		<Stage
			cam={CAM_ALL}
			fan={fan}
			cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}
			sched={{state: schedOk ? "ok" : "none"}}
			query={{state: queryOk ? "ok" : "none"}}
			pill={{reveal: 1, swap: 1}}
			flipMix={flipMix}
			flipTint={flipTint}
			lanes={{
				0: ghostLane(0),
				1: ghostLane(1),
				3: ghostLane(3),
				4: ghostLane(4),
				2: {
					eng: {state: "ok"},
					gh: {state: "ok"},
					md: {state: "ok"},
				},
			}}
		/>
	);
};
