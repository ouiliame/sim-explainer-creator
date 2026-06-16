import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ID, CAM_TABLE} from "../layoutV2";
import {camMix, ramp, Stage} from "./_v2";

// v2 scene 3 — the-workflow (assemble). The camera eases from the
// table-centered framing to identity (same layout, camera move only) and the
// docs' roundtrip chain assembles below the table, the docs-preview way:
// Table block fades in, edge draws on, Classify, edge, Table.
// Enter == scene 2 exit (CAM_TABLE, no chain); exit == scene 4 enter
// (identity camera, chain assembled idle, table unprocessed).

export const TheWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const camM = ramp(t, 0.4, 1.7, EASING.inOut);
	const cam = camMix(CAM_TABLE, CAM_ID, camM);

	const queryIn = ramp(t, 1.7, 2.3, EASING.out);
	const edge1 = ramp(t, 2.5, 3.1, EASING.inOut);
	const classifyIn = ramp(t, 3.1, 3.7, EASING.out);
	const edge2 = ramp(t, 3.9, 4.5, EASING.inOut);
	const updateIn = ramp(t, 4.5, 5.1, EASING.out);

	return (
		<Stage
			cam={cam}
			query={{opacity: queryIn}}
			classify={{opacity: classifyIn}}
			update={{opacity: updateIn}}
			edge1={{progress: edge1}}
			edge2={{progress: edge2}}
		/>
	);
};
