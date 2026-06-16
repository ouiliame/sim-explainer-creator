import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots} from "../../../components";
import {foldTransform, SLOT_HEADER_CENTER} from "../layout";
import {ChildChain, ParentChain} from "./_local";

// Scene 2 — it becomes a block. THE move of the video, first showing: the
// whole child canvas folds into a single indigo Workflow block at the
// center slot (zoom-through in reverse). The block is then configured —
// Select Workflow row reveals under a selection ring, then Input Variable —
// and the new parent assembles around it. Ends with the parent at rest.
// Beat intent: the whole workflow is now ONE step in a bigger flow —
// configuration is just "which workflow, what does it receive".
export const ItBecomesABlockScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (
		lo: number,
		hi: number,
		easing?: (n: number) => number,
	): number =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// The fold: child world shrinks about its center into the header-only
	// block footprint. The world fades late; the block fades in as it lands.
	const fold = c(0.5, 2.8, EASING.inOut);
	const childOp = 1 - c(1.8, 2.6);

	// Configuration beats.
	const blockOp = c(2.3, 2.9);
	const editing = t >= 3.3 && t < 6.0;
	const row1 = c(3.6, 4.2, EASING.out);
	const row2 = c(4.8, 5.4, EASING.out);

	// The parent assembles around the configured block.
	const startOp = c(6.2, 6.7, EASING.out);
	const agentOp = c(6.8, 7.3, EASING.out);
	const edge1 = c(6.9, 7.3, EASING.out);
	const edge2 = c(7.4, 7.8, EASING.out);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			{childOp > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: childOp,
						transform: foldTransform(SLOT_HEADER_CENTER, fold),
						transformOrigin: "0 0",
					}}
				>
					<ChildChain start={{}} agent={{}} response={{}} edge1={{}} edge2={{}} />
				</div>
			) : null}

			<ParentChain
				start={{opacity: startOp}}
				wf={{opacity: blockOp, highlighted: editing}}
				agent={{opacity: agentOp}}
				edge1={{progress: edge1}}
				edge2={{progress: edge2}}
				wfBodyReveal={row1}
				wfRow1Reveal={row1}
				wfRow2Reveal={row2}
			/>
		</AbsoluteFill>
	);
};
