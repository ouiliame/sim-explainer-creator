import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, camMix, ramp, type RowState} from "./_rig";
import {CAM_ALL, CAM_OUT} from "../layout";

// Scene 8 — the-desk [settle / bookend]
// The settled frame holds: every est filled, every edge resolved, three
// SIGNAL badges flagging, the chain green, the pill armed, the mkt odds still
// ticking. Camera eases back CAM_ALL → CAM_OUT (~6%) and holds for VO.
// Enter state == scene 7 exit (fan folded, all resolved, chain green, CAM_ALL).
const RESOLVED: RowState = {estReveal: 1, edgeReveal: 1, signalReveal: 1};

export const TheDeskScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	const cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0, 2.4, EASING.inOut));

	return (
		<Stage
			cam={cam}
			tableIn={1}
			rowReveal={() => 1}
			rowStates={() => RESOLVED}
			sched={{state: "ok"}}
			pull={{state: "ok"}}
			cont={{state: "ok"}}
			pill={{reveal: 1, swap: 1}}
			fan={0}
			laneTag={{resolve: 1}}
			lanes={{2: {analyst: {state: "ok"}}}}
		/>
	);
};
