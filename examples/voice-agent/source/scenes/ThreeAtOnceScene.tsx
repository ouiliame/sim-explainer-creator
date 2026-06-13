import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {CAM_HOME, CAM_PANEL1} from "../layout";
import {Stage} from "./_rig";
import {S5_THREE_AT_ONCE} from "./states";
import {camMix, mkClock, sceneClock} from "./_anim";

// Scene 5 — three-at-once [THE MONEY SHOT begins]. Enters on S4 (leaned
// into panel 1, the rest dimmed). Pull back to the home framing: the dims
// release and all three panels stream SIMULTANEOUSLY, de-phased — turns
// landing out of sync, three live dots, the workflow's rings still on
// above, the empty table waiting at the right. Hold the alive frame.
// Exits at S5.
export const ThreeAtOnceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {t, c} = mkClock(frame);
	const {gf, q} = sceneClock("three-at-once", frame);

	// Pull back; de-focus releases with it.
	const camP = c(0.4, 2.2, 0, 1, EASING.inOut);
	const undim = c(0.5, 1.7, 1, 0);

	// De-phased turn-taking — each panel on its own clock. Amplitudes
	// settle to S5's values so the cut into outcomes-land carries exactly.
	// Panel 1: keeps talking, takes a breath mid-scene, talking again.
	const sp0 = 1 - c(4.5, 5.3, 0, 1, EASING.inOut) + c(7.5, 8.3, 0, 1, EASING.inOut);
	// Panel 2: its human reply rises mid-scene; the agent answers, then
	// listens again (S5 leaves it listening).
	const count1 = t < 3.0 ? 1 : 2;
	const rev1 = t < 3.0 ? 1 : c(3.0, 3.8, 0, 1, EASING.out);
	const sp1 = c(5.5, 6.3, 0, 0.9, EASING.inOut) - c(9.0, 9.8, 0, 0.9, EASING.inOut);
	// Panel 3: listens, its human reply rises, the agent comes back on.
	const count2 = t < 4.6 ? 1 : 2;
	const rev2 = t < 4.6 ? 1 : c(4.6, 5.4, 0, 1, EASING.out);
	const sp2 = 0.6 - c(3.8, 4.5, 0, 0.6, EASING.inOut) + c(7.0, 7.8, 0, 0.9, EASING.inOut);

	return (
		<Stage
			frame={gf}
			state={{
				...S5_THREE_AT_ONCE,
				cam: camMix(CAM_PANEL1, CAM_HOME, camP),
				workflowDim: undim,
				panels: [
					{visible: 1, turnCount: 3, speaking: sp0},
					{visible: 1, turnCount: count1, lastReveal: rev1, speaking: sp1, dim: undim},
					{visible: 1, turnCount: count2, lastReveal: rev2, speaking: sp2, dim: undim},
				],
				quiet: q,
			}}
		/>
	);
};
