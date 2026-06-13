import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_TABLE} from "../layout";
import {Stage, camMix, ramp} from "./_rig";

// Scene 2 — the-desk-takes-shape [assemble + camera ease]. The camera
// eases out (the table glides to the top of frame — same layout, camera
// move only) while the workflow assembles in flow order: Schedule → edge
// → Polymarket (Get Markets) → edge → the Desk container — and inside
// it, ONE lane: inner wire → Analyst → Update Board.
// Enter: scene 1's exit (table only, CAM_TABLE). Exit: chain assembled
// idle, CAM_ALL.
export const DeskTakesShapeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut));

	// Assembly in flow order (the clock → the pull → the container → the
	// lane's two blocks).
	const schedIn = ramp(t, 2.0, 2.6, EASING.out);
	const edge1 = ramp(t, 3.0, 3.6);
	const polyIn = ramp(t, 4.0, 4.6, EASING.out);
	const edge2 = ramp(t, 5.2, 5.8);
	const contIn = ramp(t, 6.2, 7.0, EASING.out);
	const edgeIn = ramp(t, 7.8, 8.4);
	const anaIn = ramp(t, 8.4, 9.0, EASING.out);
	const edgeA = ramp(t, 9.8, 10.3);
	const updIn = ramp(t, 10.3, 10.9, EASING.out);

	return (
		<Stage
			cam={cam}
			sched={{opacity: schedIn}}
			poly={{opacity: polyIn}}
			cont={{opacity: contIn}}
			edge1={{progress: edge1}}
			edge2={{progress: edge2}}
			lanes={{
				2: {
					ana: {opacity: anaIn},
					upd: {opacity: updIn},
					edgeIn: {progress: edgeIn},
					edgeA: {progress: edgeA},
				},
			}}
		/>
	);
};
