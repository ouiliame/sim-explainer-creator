import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_TABLE} from "../layout";
import {Stage, pulseWindow, ramp} from "./_rig";

// Scene 1 — the-board [assemble]. Table-centered camera. The `markets`
// grid assembles: chrome + headers fade in, then the five rows stagger
// in — market + odds filled, agent_est/edge/signal empty. Row 1 takes a
// brief product range selection (one record of the watchlist) and
// releases before the cut.
// Exit state: table assembled, no selection, chain absent, CAM_TABLE.
export const TheBoardScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const tableIn = ramp(t, 0.2, 0.9);
	const rowTextReveal = (r: number) => ramp(t, 1.1 + r * 0.35, 1.7 + r * 0.35);

	// Row 1 = one market (product row selection), released before exit.
	const rowHi = pulseWindow(t, 4.6, 5.0, 6.2, 6.6);
	const cellHi = (_c: number, r: number) => (r === 0 ? rowHi : 0);

	return (
		<Stage
			cam={CAM_TABLE}
			tableIn={tableIn}
			rowTextReveal={rowTextReveal}
			cellHi={cellHi}
			sched={{hidden: true}}
			poly={{hidden: true}}
			cont={{hidden: true}}
			edge1={{opacity: 0}}
			edge2={{opacity: 0}}
		/>
	);
};
