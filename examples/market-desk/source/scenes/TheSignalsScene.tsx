import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, type LaneId} from "../layout";
import {FOLLOWED_ROW, GHOST_FINISH_ORDER, ROW_FOR_LANE} from "../data";
import {Stage, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 8 — the-signals [the money shot]. Full frame, steady camera. The
// remaining four instances finish in scramble order (parallel result
// order isn't guaranteed — the docs' sentence, drawn): each finish is a
// triplet — the lane settles ok, agent_est + edge fill with the green
// output tint decaying to the residue, and the signal cell lands
// (`watch` on the mispriced Fed row with a full-strength residue; `—` on
// the fair rows). The est column becomes a filled board with two flags
// burning. Then the fan folds back into ONE lane, the container settles
// ok, and the chain settles green in causal order.
// Exit: fan 0, chain green, all rows filled + residue, lane template,
// CAM_ALL.

// Per-ROW finish start times, in GHOST_FINISH_ORDER (rows 2, 5, 1, 3 in
// table terms) — cadenced so the fills land row after row.
const FINISH_AT: Record<number, number> = {};
GHOST_FINISH_ORDER.forEach((row, i) => {
	FINISH_AT[row] = 0.6 + i * 1.4;
});

export const TheSignalsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const fan = 1 - ramp(t, 7.6, 8.6, EASING.inOut);

	// Chain settles green in causal order after the work is done.
	const schedOk = t >= 8.9;
	const polyOk = t >= 9.15;
	const contOk = t >= 9.4;

	const ghostLane = (lane: LaneId): LaneState => {
		const f = FINISH_AT[ROW_FOR_LANE[lane]];
		return {
			ana: {highlighted: t < f, state: t >= f ? "ok" : "none"},
			upd: {highlighted: t >= f + 0.45 && t < f + 0.6, state: t >= f + 0.6 ? "ok" : "none"},
			edgeA: {hi: pulseWindow(t, f, f + 0.2, f + 0.6, f + 0.9)},
			pulseA: ramp(t, f, f + 0.35, EASING.inOut),
		};
	};

	// Row fills: the followed row done since scene 7 (held residue);
	// ghost rows fill at their lane's finish, pulse, and decay to the
	// same residue. The two `watch` rows keep a full-strength signal
	// residue — the flag reads as color.
	const fillMix = (r: number) => {
		if (r === FOLLOWED_ROW) return 1;
		const f = FINISH_AT[r];
		return f === undefined ? 0 : ramp(t, f + 0.7, f + 1.2);
	};
	const fillTint = (r: number) => {
		if (r === FOLLOWED_ROW) return 0.35;
		const f = FINISH_AT[r];
		if (f === undefined) return 0;
		return ramp(t, f + 0.7, f + 1.2) * (1 - 0.65 * ramp(t, f + 1.7, f + 2.7));
	};
	const signalTint = (r: number) => {
		if (r === FOLLOWED_ROW) return 1;
		if (r === 0) return ramp(t, FINISH_AT[0] + 0.7, FINISH_AT[0] + 1.3);
		return 0;
	};

	// The inner lane's ok rings release as the container absorbs them.
	const laneSettled = t < 9.4;

	return (
		<Stage
			cam={CAM_ALL}
			fan={fan}
			cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}
			sched={{state: schedOk ? "ok" : "none"}}
			poly={{state: polyOk ? "ok" : "none"}}
			pill={{reveal: 1, swap: 1}}
			fillMix={fillMix}
			fillTint={fillTint}
			signalTint={signalTint}
			lanes={{
				0: ghostLane(0),
				1: ghostLane(1),
				3: ghostLane(3),
				4: ghostLane(4),
				2: {
					ana: {state: laneSettled ? "ok" : "none"},
					upd: {state: laneSettled ? "ok" : "none"},
				},
			}}
		/>
	);
};
