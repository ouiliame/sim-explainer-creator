import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2, foldTransform, SLOT_HEADER_CENTER} from "../layout";
import {OuterChain, ParentChain} from "./_local";

// Scene 6 — workflows all the way up. The same move, one level up: the
// whole parent canvas folds into a single indigo Workflow block at the
// center of a header-only outer chain. One pulse crosses it — a blip on
// the block (the entire story compressed to a beat) — then the outer chain
// holds, balanced and still.
// Beat intent: a parent is itself a workflow — composition goes all the
// way up; keep each piece small and call it anywhere.
export const WorkflowsAllTheWayUpScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, easing?: (n: number) => number): number =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	const fold = c(0.5, 2.6, EASING.inOut);
	const parentOp = 1 - c(1.7, 2.4);

	const wfOp = c(2.1, 2.7);
	const startOp = c(2.9, 3.4, EASING.out);
	const agentOp = c(3.1, 3.6, EASING.out);
	const edge1 = c(3.3, 3.7, EASING.out);
	const edge2 = c(3.5, 3.9, EASING.out);

	const pulse1 = c(4.4, 5.05);
	const wfBlip = t >= 5.0 && t < 5.6;
	const pulse2 = c(5.6, 6.25);
	const agentBlip = t >= 6.2 && t < 6.7;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			{parentOp > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: parentOp,
						transform: foldTransform(SLOT_HEADER_CENTER, fold),
						transformOrigin: "0 0",
					}}
				>
					<ParentChain start={{}} wf={{}} agent={{}} edge1={{}} edge2={{}} />
				</div>
			) : null}

			<OuterChain
				start={{opacity: startOp}}
				wf={{opacity: wfOp, highlighted: wfBlip}}
				agent={{opacity: agentOp, highlighted: agentBlip}}
				edge1={{progress: edge1}}
				edge2={{progress: edge2}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
		</AbsoluteFill>
	);
};
