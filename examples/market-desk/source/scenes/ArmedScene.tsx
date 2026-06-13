import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL} from "../layout";
import {Stage, ramp} from "./_rig";

// Scene 4 — armed [morph at state level]. The blue editing ring lands on
// the Schedule block (deploying is an act you perform on the workflow)
// and the schedule pill rises above it: green live dot +
// `Every hour · Next: Jun 12, 3:00 PM`. Ring releases; pill stays.
// Enter: template chain. Exit: armed state (pill, swap 0), CAM_ALL.
export const ArmedScene: React.FC = () => {
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
