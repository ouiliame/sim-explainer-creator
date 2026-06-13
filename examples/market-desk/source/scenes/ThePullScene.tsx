import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, TABLE_ROWS} from "../layout";
import {ODDS_COL} from "../data";
import {Stage, pulseWindow, ramp} from "./_rig";

// Scene 5 — the-pull [run, freeze]. Nothing arrives from anywhere: the
// Schedule ring lights ON ITS OWN and the pill's Next dips forward
// (3:00 PM → 4:00 PM — fired and instantly re-armed). Pulse crosses
// edge 1; Polymarket goes live and IN SYNC the five market+odds rows
// light as one product selection range (the pull confirming the board;
// synchrony only). The range releases as the pulse crosses edge 2 into
// the container; the container's live ring comes on — and HOLDS through
// the cut.
// Enter: armed (swap 0). Exit (freeze-cut): container live, pill swap 1,
// everything else template, CAM_ALL.
export const ThePullScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The self-fire.
	const schedLive = t >= 1.0 && t < 2.5;
	const pillSwap = ramp(t, 1.3, 1.8);

	const pulse1 = ramp(t, 2.2, 2.9, EASING.inOut);
	const edge1Hi = pulseWindow(t, 2.2, 2.6, 4.0, 4.5);

	// The pull confirms its markets — live ring and the range, in sync.
	// Only the pre-seeded columns light: market + odds is what
	// get_markets returns.
	const polyLive = t >= 2.8 && t < 5.5;
	const polyOk = t >= 5.5 && t < 7.2;
	const rangeHi = (r: number) =>
		Math.min(ramp(t, 3.1 + r * 0.14, 3.6 + r * 0.14), 1 - ramp(t, 5.5, 6.1));
	const cellHi = (c: number, r: number) =>
		c <= ODDS_COL && r < TABLE_ROWS ? rangeHi(r) : 0;

	const pulse2 = ramp(t, 5.6, 6.3, EASING.inOut);
	const edge2Hi = pulseWindow(t, 5.6, 6.0, 7.3, 7.8);

	// The whole batch enters the desk — and the moment holds.
	const contLive = t >= 6.2;

	return (
		<Stage
			cam={CAM_ALL}
			cellHi={cellHi}
			sched={{highlighted: schedLive}}
			poly={{highlighted: polyLive, state: polyOk ? "ok" : "none"}}
			cont={{highlighted: contLive}}
			edge1={{hi: edge1Hi}}
			edge2={{hi: edge2Hi}}
			pulse1={pulse1}
			pulse2={pulse2}
			pill={{reveal: 1, swap: pillSwap}}
			lanes={{2: {}}}
		/>
	);
};
