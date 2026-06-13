import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, camMix, ramp} from "./_rig";
import {CAM_ALL, CAM_BOARD} from "../layout";

// Scene 2 — the-desk-takes-shape [assemble + camera ease]
// Camera eases CAM_BOARD → CAM_ALL (the board glides to the top of frame).
// Below, the desk assembles in flow order: Schedule → Pull Markets → Desk
// container (with the Analyst lane inside). Edges draw on after their blocks.
// Exit state: full set piece idle, chain present, CAM_ALL.
export const TheDeskTakesShapeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	const cam = camMix(CAM_BOARD, CAM_ALL, ramp(t, 0, 1.8, EASING.inOut));

	const schedIn = ramp(t, 1.6, 2.4, EASING.out);
	const edge1 = ramp(t, 2.4, 3.0, EASING.inOut);
	const pullIn = ramp(t, 2.9, 3.7, EASING.out);
	const edge2 = ramp(t, 3.7, 4.3, EASING.inOut);
	const contIn = ramp(t, 4.2, 5.2, EASING.out);
	const analystIn = ramp(t, 5.4, 6.4, EASING.out);
	// The armed schedule pill rises just after the Schedule block lands.
	const pillIn = ramp(t, 2.2, 3.0, EASING.out);

	return (
		<Stage
			cam={cam}
			tableIn={1}
			rowReveal={() => 1}
			rowStates={() => ({})}
			sched={{opacity: schedIn}}
			pull={{opacity: pullIn}}
			cont={{opacity: contIn}}
			edge1={{opacity: edge1, progress: edge1}}
			edge2={{opacity: edge2, progress: edge2}}
			pill={{reveal: pillIn, swap: 0}}
			fan={0}
			lanes={{2: {analyst: {opacity: analystIn}}}}
		/>
	);
};
