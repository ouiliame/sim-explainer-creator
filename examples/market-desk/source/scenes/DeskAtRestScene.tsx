import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_OUT} from "../layout";
import {FOLLOWED_ROW} from "../data";
import {Stage, camMix, ramp} from "./_rig";

// Scene 9 — the-desk-at-rest [settle / bookend]. The settled frame
// holds: every row priced, two watch flags burning, the chain green,
// the pill still armed for the next hour. The camera eases back ~6% and
// holds the balanced frame for VO. Enter: scene 8's exit, CAM_ALL.
export const DeskAtRestScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

	return (
		<Stage
			cam={cam}
			fan={0}
			sched={{state: "ok"}}
			poly={{state: "ok"}}
			cont={{state: "ok"}}
			pill={{reveal: 1, swap: 1}}
			fillMix={() => 1}
			fillTint={() => 0.35}
			signalTint={(r) => (r === 0 || r === FOLLOWED_ROW ? 1 : 0)}
			lanes={{2: {}}}
		/>
	);
};
