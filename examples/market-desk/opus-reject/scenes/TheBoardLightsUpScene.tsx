import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, ramp, type LaneState, type RowState} from "./_rig";
import {CAM_ALL, LANE_IDS, type LaneId} from "../layout";
import {FOLLOWED_ROW, GHOST_FINISH_ORDER} from "../data";

// Scene 7 — the-board-lights-up [the money shot]
// Full frame, steady camera. The remaining five Analysts finish in scramble
// order; each finish fills that row's est cell (DipSwap) and resolves its
// edge. Two more rows clear the threshold and flag SIGNAL (rows 0 and 4 — row
// 2 already flagged in scene 6). Then the fan folds back to one lane, the
// container settles ok, and the chain settles green in causal order.
// Exit state: fan = 0, all rows resolved, three SIGNAL badges, chain green
// (Schedule / Pull / Desk ok), pill armed, CAM_ALL.
export const TheBoardLightsUpScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	// Each ghost finishes 0.85s apart starting at 0.4s; its row resolves
	// est → edge → (signal) over ~1.6s.
	const FINISH_GAP = 0.85;
	const finishT = (slot: number) => 0.4 + slot * FINISH_GAP;

	// Map: which finish-slot does each row occupy? (followed row already done.)
	const slotOfRow = (row: number): number => GHOST_FINISH_ORDER.indexOf(row as never);

	const rowStates = (row: number): RowState => {
		if (row === FOLLOWED_ROW) {
			return {estReveal: 1, edgeReveal: 1, signalReveal: 1};
		}
		const slot = slotOfRow(row);
		if (slot < 0) return {};
		const f0 = finishT(slot);
		return {
			estReveal: ramp(t, f0, f0 + 0.9, EASING.out),
			edgeReveal: ramp(t, f0 + 1.0, f0 + 1.8, EASING.out),
			signalReveal: ramp(t, f0 + 1.9, f0 + 2.6, EASING.out),
		};
	};

	// Ghost Analysts settle ok as their row resolves; fold the fan after all
	// finish (~5.1s for the last slot's edge), settle the chain green.
	const allDone = finishT(GHOST_FINISH_ORDER.length - 1) + 1.8; // ~5.6s
	const fan = 1 - ramp(t, allDone + 0.3, allDone + 1.6, EASING.inOut);
	const contOk = t >= allDone + 0.3;

	const laneFor = (lane: LaneId): LaneState => {
		if (lane === 2) return {analyst: {state: "ok"}};
		// Map ghost lane index → its finishing market row is not needed for the
		// ghost's own ok state; settle all ghosts ok progressively, then fold.
		const slot = LANE_IDS.filter((l) => l !== 2).indexOf(lane);
		const f0 = finishT(slot);
		return {analyst: {state: t >= f0 + 0.9 ? "ok" : "none", highlighted: t < f0 + 0.9}};
	};
	const lanes: Partial<Record<LaneId, LaneState>> = {};
	LANE_IDS.forEach((l) => (lanes[l] = laneFor(l)));

	return (
		<Stage
			cam={CAM_ALL}
			tableIn={1}
			rowReveal={() => 1}
			rowStates={rowStates}
			sched={{state: "ok"}}
			pull={{state: "ok"}}
			cont={{state: contOk ? "ok" : "none", highlighted: !contOk}}
			pill={{reveal: 1, swap: 1}}
			fan={fan}
			laneTag={{resolve: 1}}
			lanes={lanes}
		/>
	);
};
