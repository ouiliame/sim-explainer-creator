import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL} from "../layout";
import {Stage, ramp} from "./_rig";

// Scene 4 — lights-out [morph at state level]. The blue editing ring
// lands on the Schedule block (deploying is an act you perform on the
// workflow) and the schedule pill rises above it: green live dot +
// `At 12:00 AM · Next: Mar 18, 12:00 AM`. Ring releases; pill stays.
// Enter: template chain. Exit: armed state (pill, swap 0), CAM_ALL.
export const LightsOutScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const editing = t >= 0.6 && t < 2.6;
	const pillReveal = ramp(t, 1.5, 2.1, EASING.out);

	return (
		<Stage
			cam={CAM_ALL}
			sched={{highlighted: editing}}
			pill={{reveal: pillReveal, swap: 0}}
			lanes={{2: {}}}
		/>
	);
};
