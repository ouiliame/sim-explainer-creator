import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {Stage} from "./_rig";
import {S1_THE_WORKFLOW} from "./states";
import {mkClock, sceneClock} from "./_anim";

// Scene 1 — the-workflow [assemble]. Camera on the top band. The chain
// assembles left→right: Start fades in, edge 1 draws, Campaign, edge 2,
// then the Parallel container "Call each" draws on holding its ONE lane:
// inner Start pill → Call (Create Call) → Log outcome (Insert Row). The
// <parallel.currentItem> tag glows once and releases — the wiring that
// makes one lane become N calls. Settles into S1 (the clean chain at
// rest); the aside band stays empty.
export const TheWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {c} = mkClock(frame);
	const {gf, q} = sceneClock("the-workflow", frame);

	// Left→right assembly: blocks fade in (EASING.out), edges draw between
	// them (EASING.inOut — a transform, not an entrance).
	const startOp = c(0.3, 0.9, 0, 1, EASING.out);
	const edge1Draw = c(1.0, 1.5, 0, 1, EASING.inOut);
	const campOp = c(1.4, 2.0, 0, 1, EASING.out);
	const edge2Draw = c(2.2, 2.7, 0, 1, EASING.inOut);
	const contOp = c(2.6, 3.3, 0, 1, EASING.out);
	const pillDraw = c(3.4, 3.9, 0, 1, EASING.inOut);
	const callOp = c(3.8, 4.4, 0, 1, EASING.out);
	const laneDraw = c(4.6, 5.1, 0, 1, EASING.inOut);
	const logOp = c(5.0, 5.6, 0, 1, EASING.out);

	// The reference beat: <parallel.currentItem> glows once and releases.
	const tagGlow = Math.min(c(6.2, 6.6), c(7.4, 8.0, 1, 0));

	return (
		<Stage
			frame={gf}
			state={{
				...S1_THE_WORKFLOW,
				start: {opacity: startOp},
				campaign: {opacity: campOp},
				container: {opacity: contOp},
				call: {opacity: callOp},
				log: {opacity: logOp},
				edge1: {progress: edge1Draw},
				edge2: {progress: edge2Draw},
				pillE: {progress: pillDraw},
				laneE: {progress: laneDraw},
				tagGlow,
				quiet: q,
			}}
		/>
	);
};
