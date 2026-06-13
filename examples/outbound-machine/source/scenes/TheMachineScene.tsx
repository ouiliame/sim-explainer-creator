import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_TABLE} from "../layout";
import {Stage, camMix, ramp} from "./_rig";

// Scene 2 — the-machine [assemble + camera ease]. Camera eases CAM_TABLE →
// CAM_ALL (the table glides to the top band, camera move only). Below, the
// machine assembles in flow order: Apollo → edge → the Enrich container
// (Split chip, inner Start pill, ONE lane: Data Enrichment → Personalize →
// Instantly) → edge → the Table block (Batch Insert Rows).
// Exit: machine assembled idle, CAM_ALL.

const NONE = () => 0;

export const TheMachineScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera ease out over the first 2.2s.
	const camM = ramp(t, 0.2, 2.4, EASING.inOut);
	const cam = camMix(CAM_TABLE, CAM_ALL, camM);

	// Assembly cadence, flow order (after the camera has mostly settled).
	const apolloIn = ramp(t, 2.6, 3.2, EASING.out);
	const edge1P = ramp(t, 3.3, 4.0, EASING.inOut);
	const contIn = ramp(t, 4.1, 4.8, EASING.out);
	const laneIn = ramp(t, 5.1, 5.8, EASING.out);
	const laneEdgeP = ramp(t, 5.9, 6.7, EASING.inOut);
	const edge2P = ramp(t, 7.0, 7.7, EASING.inOut);
	const wbIn = ramp(t, 7.7, 8.4, EASING.out);

	return (
		<Stage
			cam={cam}
			rowLand={NONE}
			apollo={{opacity: apolloIn}}
			edge1={{progress: edge1P}}
			cont={{opacity: contIn}}
			edge2={{progress: edge2P}}
			wb={{opacity: wbIn}}
			fan={0}
			lanes={{
				2: {
					enr: {opacity: laneIn},
					pers: {opacity: laneIn},
					send: {opacity: laneIn},
					edgeIn: {progress: laneEdgeP},
					edgeA: {progress: laneEdgeP},
					edgeB: {progress: laneEdgeP},
				},
			}}
		/>
	);
};
