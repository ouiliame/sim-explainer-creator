import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {CAM_HOME, CAM_PANEL1} from "../layout";
import {Stage} from "./_rig";
import {S4_ONE_CONVERSATION} from "./states";
import {camMix, mkClock, sceneClock} from "./_anim";

// Scene 4 — one-conversation [the mechanism, lean-in]. Enters on S3. The
// camera leans toward panel 1 (the workflow stays visible above, dimmed;
// panels 2–3 dim and go quiet). The turn loop streams on panel 1: the
// agent speaks (waveform live) → flatlines → the human reply rises as
// skeleton bars → the waveform springs back for the agent's authored
// confirmation line. The live dot keeps pulsing. Exits at S4.
export const OneConversationScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {t, c} = mkClock(frame);
	const {gf, q} = sceneClock("one-conversation", frame);

	// The lean: camera + de-focus move together (EASING.inOut, camera rule).
	const camP = c(0.5, 2.2, 0, 1, EASING.inOut);
	const dim = c(0.7, 1.9);

	// Panel 1's turn loop. Carried in speaking the greeting (speaking=1):
	// flatline → human bars rise (turn 2) → the confirmation line (turn 3)
	// with the waveform springing back under it.
	const turn2 = c(4.2, 5.0, 0, 1, EASING.out);
	const turn3 = c(7.4, 8.2, 0, 1, EASING.out);
	const sp0 = 1 - c(3.0, 3.7, 0, 1, EASING.inOut) + c(7.0, 7.8, 0, 1, EASING.inOut);
	const count0 = t < 4.2 ? 1 : t < 7.4 ? 2 : 3;
	const rev0 = t < 4.2 ? 1 : t < 7.4 ? turn2 : turn3;

	// Background panels settle to their dim S4 amplitudes.
	const sp1 = 0.85 - c(0.9, 2.0, 0, 0.85, EASING.inOut);
	const sp2 = 0.7 - c(0.9, 2.0, 0, 0.1, EASING.inOut);

	return (
		<Stage
			frame={gf}
			state={{
				...S4_ONE_CONVERSATION,
				cam: camMix(CAM_HOME, CAM_PANEL1, camP),
				workflowDim: dim,
				panels: [
					{visible: 1, turnCount: count0, lastReveal: rev0, speaking: sp0},
					{visible: 1, turnCount: 1, speaking: sp1, dim},
					{visible: 1, turnCount: 1, speaking: sp2, dim},
				],
				quiet: q,
			}}
		/>
	);
};
