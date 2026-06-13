import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, ramp, pulseWindow} from "./_rig";
import {CAM_ALL} from "../layout";
import {ROW_COUNT} from "../data";

// Scene 4 — the-sweep [run, freeze]
// The Schedule ring lights ON ITS OWN; the pill's Next date dips forward. A
// pulse crosses edge 1; Pull Markets goes live and IN SYNC all six board rows
// light as one product selection range. The range releases as the pulse
// crosses edge 2 into the container; the container's live ring comes on and
// HOLDS through the cut (freeze-cut to scene 5).
// Exit state: container highlighted, pill swapped (Next advanced), board range
// released, Schedule/Pull settled live → ok, CAM_ALL.
export const TheSweepScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	// Schedule fires on its own, then settles green and holds.
	const schedLive = t > 0.5 && t < 1.6;
	const schedOk = t >= 1.5;
	const pillSwap = ramp(t, 0.9, 1.4, EASING.inOut); // Next: Jun 13 → Jun 14

	// Pulse 1 → Pull Markets.
	const pulse1 = ramp(t, 1.4, 2.4);
	const pullLive = t > 2.3 && t < 3.0;
	const pullOk = t >= 2.9;

	// Board range: all six rows light as the pull returns them.
	const range = pulseWindow(t, 2.8, 3.4, 5.4, 5.9);
	const cellHi = (_col: number, row: number) => (row < ROW_COUNT ? range : 0);

	// Pulse 2 → container; the live ring comes on and HOLDS to the end.
	const pulse2 = ramp(t, 4.0, 5.0);
	const contLive = t >= 4.9;

	return (
		<Stage
			cam={CAM_ALL}
			tableIn={1}
			rowReveal={() => 1}
			rowStates={() => ({})}
			cellHi={cellHi}
			sched={{highlighted: schedLive, state: schedOk ? "ok" : "none"}}
			pull={{highlighted: pullLive, state: pullOk ? "ok" : "none"}}
			cont={{highlighted: contLive}}
			edge1={{progress: 1, hi: pulse1 > 0 && pulse1 < 1 ? 1 : 0}}
			edge2={{progress: 1, hi: pulse2 > 0 && pulse2 < 1 ? 1 : 0}}
			pulse1={pulse1}
			pulse2={pulse2}
			pill={{reveal: 1, swap: pillSwap}}
			fan={0}
			lanes={{2: {analyst: {}}}}
		/>
	);
};
