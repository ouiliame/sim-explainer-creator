import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {CAM_HOME, CAM_OUT} from "../layout";
import {Stage} from "./_rig";
import {S7_THE_CAMPAIGN_RAN} from "./states";
import {camMix, mkClock, sceneClock} from "./_anim";

// Scene 7 — the-campaign-ran [settle / bookend]. Enters on the settled
// frame (clean chain, fan retracted, rings released; three quiet panels
// with their ✓ stamps; the table full). The camera eases back ~3%, and
// each table row takes one quiet sequential pulse, 1→3 — the run retold
// without re-running. Every pulse absorbs before the end.
export const TheCampaignRanScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {c} = mkClock(frame);
	const {gf, q} = sceneClock("the-campaign-ran", frame);

	const camP = c(0.4, 2.0, 0, 1, EASING.inOut);

	// One quiet pulse per row, sequential 1→3 (the retell).
	const pulseAt = (a: number) => Math.min(c(a, a + 0.3), c(a + 0.7, a + 1.2, 1, 0));
	const rowPulse: [number, number, number] = [pulseAt(2.4), pulseAt(3.8), pulseAt(5.2)];

	return (
		<Stage
			frame={gf}
			state={{
				...S7_THE_CAMPAIGN_RAN,
				cam: camMix(CAM_HOME, CAM_OUT, camP),
				rowPulse,
				quiet: q,
			}}
		/>
	);
};
