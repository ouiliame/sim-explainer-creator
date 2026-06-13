import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, TABLE_ROWS} from "../layout";
import {Stage, pulseWindow, ramp} from "./_rig";

// Scene 5 — midnight [run, freeze]. Nothing arrives from anywhere: the
// Schedule ring lights ON ITS OWN and the pill's date dips forward
// (fired and instantly re-armed). Pulse crosses edge 1; Get Issues goes
// live and IN SYNC all five table rows light as one product selection
// range (the query selecting status = 'open'; synchrony only). The range
// releases as the pulse crosses edge 2 into the container; the
// container's live ring comes on — and HOLDS through the cut.
// Enter: armed (swap 0). Exit (freeze-cut): container live, pill swap 1,
// everything else template, CAM_ALL.
export const MidnightScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The self-fire.
	const schedLive = t >= 1.0 && t < 2.6;
	const pillSwap = ramp(t, 1.3, 1.8);

	const pulse1 = ramp(t, 2.3, 3.0, EASING.inOut);
	const edge1Hi = pulseWindow(t, 2.3, 2.7, 4.2, 4.7);

	// The query selects its rows — the live ring and the range, in sync.
	const queryLive = t >= 2.9 && t < 5.9;
	const queryOk = t >= 5.9 && t < 7.6;
	const rangeHi = (r: number) =>
		Math.min(ramp(t, 3.2 + r * 0.14, 3.7 + r * 0.14), 1 - ramp(t, 5.9, 6.5));
	const cellHi = (_c: number, r: number) => (r < TABLE_ROWS ? rangeHi(r) : 0);

	const pulse2 = ramp(t, 6.0, 6.7, EASING.inOut);
	const edge2Hi = pulseWindow(t, 6.0, 6.4, 7.7, 8.2);

	// The whole batch enters the fleet — and the moment holds.
	const contLive = t >= 6.6;

	return (
		<Stage
			cam={CAM_ALL}
			cellHi={cellHi}
			sched={{highlighted: schedLive}}
			query={{highlighted: queryLive, state: queryOk ? "ok" : "none"}}
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
