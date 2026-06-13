import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, camMix, ramp, type LaneState, type RowState} from "./_rig";
import {CAM_ALL, CAM_CONT, CAM_LANE, LANE_IDS, type LaneId} from "../layout";
import {FOLLOWED_ROW} from "../data";

// Scene 6 — one-market [camera lean-in, same run]
// Opens inside the held moment (CAM_CONT, fan = 1, six Analysts live, chips
// ringing). Camera pushes CAM_CONT → CAM_LANE; the followed Analyst's three
// chips finish and it settles ok. Camera eases back CAM_LANE → CAM_ALL just
// in time to see the followed row resolve: est DipSwaps in, edge resolves
// (amber), SIGNAL flags. The other five Analysts stay live.
// Exit state (freeze-cut): fan = 1, followed Analyst ok, followed row flipped
// (est + edge + SIGNAL), five ghost Analysts live, container live, CAM_ALL.
export const OneMarketScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	// Push in, then ease back out to the full frame.
	const inMix = ramp(t, 0, 1.4, EASING.inOut);
	const outMix = ramp(t, 5.8, 7.6, EASING.inOut);
	const cam = camMix(camMix(CAM_CONT, CAM_LANE, inMix), CAM_ALL, outMix);

	// Chips finish ringing; the Analyst settles ok.
	const analystOk = t >= 4.4;

	// The followed row resolves as the camera pulls back.
	const estReveal = ramp(t, 6.8, 7.8, EASING.out);
	const edgeReveal = ramp(t, 8.2, 9.2, EASING.out);
	const signalReveal = ramp(t, 9.4, 10.2, EASING.out);

	const followedState: RowState = {estReveal, edgeReveal, signalReveal};
	const rowStates = (row: number): RowState => (row === FOLLOWED_ROW ? followedState : {});

	const laneFor = (lane: LaneId): LaneState => {
		if (lane === 2) return {analyst: {state: analystOk ? "ok" : "none", highlighted: !analystOk}};
		return {analyst: {highlighted: true}};
	};
	const lanes: Partial<Record<LaneId, LaneState>> = {};
	LANE_IDS.forEach((l) => (lanes[l] = laneFor(l)));

	return (
		<Stage
			cam={cam}
			tableIn={1}
			rowReveal={() => 1}
			rowStates={rowStates}
			sched={{state: "ok"}}
			pull={{state: "ok"}}
			cont={{highlighted: true}}
			pill={{reveal: 1, swap: 1}}
			fan={1}
			laneTag={{resolve: 1}}
			lanes={lanes}
		/>
	);
};
