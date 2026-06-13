import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_OUT} from "../layout";
import {Stage, camMix, ramp} from "./_rig";

// Scene 9 — morning [settle / bookend]. The settled frame holds: every
// status done, every pr filled, the chain green, the pill still armed
// for the next midnight. The camera eases back ~6% and holds the
// balanced frame for VO. Enter: scene 8's exit, CAM_ALL.
export const MorningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

	return (
		<Stage
			cam={cam}
			fan={0}
			cont={{state: "ok"}}
			sched={{state: "ok"}}
			query={{state: "ok"}}
			pill={{reveal: 1, swap: 1}}
			flipMix={() => 1}
			flipTint={() => 0.35}
			lanes={{2: {eng: {state: "ok"}, gh: {state: "ok"}, md: {state: "ok"}}}}
		/>
	);
};
