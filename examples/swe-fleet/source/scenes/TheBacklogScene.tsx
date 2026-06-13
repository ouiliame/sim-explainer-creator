import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_TABLE} from "../layout";
import {Stage, pulseWindow, ramp} from "./_rig";

// Scene 1 — the-backlog [assemble]. Table-centered camera. The `backlog`
// grid assembles: chrome + headers fade in, then the five rows stagger in
// — every status `open`, every pr empty. Row 1 takes a brief product row
// selection (one range outline + tint) and releases before the cut.
// Exit state: table assembled, no selection, chain absent, CAM_TABLE.
export const TheBacklogScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const tableIn = ramp(t, 0.2, 0.9);
	const rowTextReveal = (r: number) => ramp(t, 1.1 + r * 0.35, 1.7 + r * 0.35);

	// Row 1 = one record (product row selection), released before exit.
	const rowHi = pulseWindow(t, 4.6, 5.0, 6.2, 6.6);
	const cellHi = (_c: number, r: number) => (r === 0 ? rowHi : 0);

	return (
		<Stage
			cam={CAM_TABLE}
			tableIn={tableIn}
			rowTextReveal={rowTextReveal}
			cellHi={cellHi}
			sched={{hidden: true}}
			query={{hidden: true}}
			cont={{hidden: true}}
			edge1={{opacity: 0}}
			edge2={{opacity: 0}}
			lanes={{2: {eng: {hidden: true}, gh: {hidden: true}, md: {hidden: true}, edgeIn: {opacity: 0}, edgeA: {opacity: 0}, edgeB: {opacity: 0}}}}
		/>
	);
};
