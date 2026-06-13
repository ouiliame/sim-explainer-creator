import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_TABLE} from "../layout";
import {Stage, ramp} from "./_rig";

// Scene 1 — the-empty-table [problem visual / table hero]. Table-centered.
// The `outbound` grid assembles: the pane fades in, then the six header
// cells (with type icons) appear left→right over an EMPTY six-row pane.
// A collective selection-tint pulse over the empty pane releases — the
// campaign that doesn't exist yet is the job.
// Exit: table assembled, zero rows, selection released, CAM_TABLE.

const NONE = () => 0;

export const TheEmptyTableScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The pane (frame + row numbers) fades in, then the header assembles
	// column by column, left→right.
	const tableIn = ramp(t, 0.3, 1.0, EASING.out);
	const colIn = (c: number) => ramp(t, 1.1 + c * 0.22, 1.65 + c * 0.22, EASING.out);

	// Collective selection pulse over the empty pane: up 4.0→4.7, release
	// 6.2→7.0 — the blank record is the job.
	const paneSel = Math.min(ramp(t, 4.0, 4.7, EASING.out), 1 - ramp(t, 6.2, 7.0, EASING.in));

	return (
		<Stage
			cam={CAM_TABLE}
			tableIn={tableIn}
			colIn={colIn}
			paneSel={paneSel}
			rowLand={NONE}
			apollo={{hidden: true}}
			cont={{hidden: true}}
			wb={{hidden: true}}
			edge1={{progress: 0}}
			edge2={{progress: 0}}
		/>
	);
};
