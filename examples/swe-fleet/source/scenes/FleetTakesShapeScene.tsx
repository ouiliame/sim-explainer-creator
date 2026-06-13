import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_TABLE} from "../layout";
import {Stage, camMix, ramp} from "./_rig";

// Scene 2 — the-fleet-takes-shape [assemble + camera ease]. The camera
// eases out (the table glides to the top of frame — same layout, camera
// move only) while the workflow assembles in flow order: Schedule → edge
// → Get Issues → edge → the Fleet container — and inside it the lane:
// inner wire → Engineer → GitHub → Mark Done.
// Enter: scene 1's exit (table only, CAM_TABLE). Exit: chain assembled
// idle, CAM_ALL.
export const FleetTakesShapeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut));

	// Assembly paced to the narration's clauses (Schedule → query → the
	// container → the lane's three blocks).
	const schedIn = ramp(t, 2.0, 2.6, EASING.out);
	const edge1 = ramp(t, 3.2, 3.8);
	const queryIn = ramp(t, 4.2, 4.8, EASING.out);
	const edge2 = ramp(t, 5.6, 6.2);
	const contIn = ramp(t, 6.6, 7.4, EASING.out);
	const edgeIn = ramp(t, 8.4, 9.0);
	const engIn = ramp(t, 9.0, 9.6, EASING.out);
	const edgeA = ramp(t, 10.6, 11.1);
	const ghIn = ramp(t, 11.1, 11.7, EASING.out);
	const edgeB = ramp(t, 12.8, 13.3);
	const mdIn = ramp(t, 13.3, 13.9, EASING.out);

	return (
		<Stage
			cam={cam}
			sched={{opacity: schedIn}}
			query={{opacity: queryIn}}
			cont={{opacity: contIn}}
			edge1={{progress: edge1}}
			edge2={{progress: edge2}}
			lanes={{
				2: {
					eng: {opacity: engIn},
					gh: {opacity: ghIn},
					md: {opacity: mdIn},
					edgeIn: {progress: edgeIn},
					edgeA: {progress: edgeA},
					edgeB: {progress: edgeB},
				},
			}}
		/>
	);
};
