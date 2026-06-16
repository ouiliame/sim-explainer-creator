import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {ParentChain} from "./_local";

// Scene 3 — the call begins. A parent run starts: "I want a refund" dips
// into Start's Inputs row, the pulse crosses edge 1, and as it lands the
// block's <start.input> tag resolves to the same value — the handoff is
// visible in the block's own config row. The Workflow block's live ring
// comes on… and HOLDS through the scene boundary (freeze-cut): nothing
// moves past the block.
// Beat intent: the run reaches the block and parks — the block has the
// parent's value, and now it has to go run something.
export const TheCallBeginsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number): number =>
		interpolate(t, [lo, hi], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

	const inputMix = c(1.0, 1.4);
	const startBlip = t >= 1.3 && t < 1.8;
	const pulse1 = c(1.7, 2.35);
	// The tag glows as the pulse lands, then resolves in place; the residue
	// (ResolvedTag) keeps provenance visible through the hold.
	const ivGlow = c(2.1, 2.35) * (1 - c(2.75, 3.1));
	const ivMix = c(2.35, 2.75);
	const wfLive = t >= 2.35; // …and holds — the freeze-cut's carried state.

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<ParentChain
				start={{highlighted: startBlip}}
				wf={{highlighted: wfLive}}
				agent={{}}
				edge1={{}}
				edge2={{}}
				inputMix={inputMix}
				iv={{glow: ivGlow, mix: ivMix}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
		</AbsoluteFill>
	);
};
