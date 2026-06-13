import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_OUT} from "../layout";
import {STATUS_COL} from "../data";
import {Stage, camMix, ramp} from "./_rig";

// Scene 8 — the-sent-campaign [settle / bookend]. The run is settled: the
// chain is green end-to-end under the full table; the camera eases back
// ~5% and holds the balanced frame for VO. The empty pane of scene 1 is
// now a sent campaign — the run wrote its own record (the landed values
// and the status-column residue persist to the final frame).

const FULL = () => 1;
const finalTint = (c: number) => (c === STATUS_COL ? 0.12 : 0);

export const TheSentCampaignScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera eases back, then everything holds.
	const outM = ramp(t, 0.8, 2.4, EASING.inOut);
	const cam = camMix(CAM_ALL, CAM_OUT, outM);

	return (
		<Stage
			cam={cam}
			rowLand={FULL}
			cellTint={finalTint}
			apollo={{state: "ok"}}
			cont={{state: "ok"}}
			wb={{state: "ok"}}
			fan={0}
			lanes={{2: {enr: {state: "ok"}, pers: {state: "ok"}, send: {state: "ok"}}}}
			itemTag={{resolve: 1}}
			contactTag={{resolve: 1}}
		/>
	);
};
