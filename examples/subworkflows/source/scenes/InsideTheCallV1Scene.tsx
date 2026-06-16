import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2, pushTransform} from "../layout";
import {ChildChain, ParentChain} from "./_local";

// Scene 4 (ORIGINAL v1 take — zoom-through; superseded by the accepted
// expand-beneath cut in InsideTheCallScene.tsx, see examples/subworkflows). Opens INSIDE scene 3's held moment (the same
// frame), then the camera pushes through the live Workflow block until the
// child canvas resolves underneath — the chain from scene 1. The handed-off
// value arrives in the child Start's Inputs row (this IS start.input) and
// the child runs end-to-end: <start.input> resolves in its Messages row,
// <agent.content> resolves to "billing" in its Response Data row, and the
// child settles green in causal order. HOLDS completed through the boundary
// — still the parent's one run.
// Beat intent: inside the block, the child workflow runs the whole way —
// the value you passed IS its start.input.
export const InsideTheCallV1Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, easing?: (n: number) => number): number =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// Camera pushes through the block; the parent world recedes, the child
	// world (template state) fades in at identity.
	const z = c(0.7, 2.9, EASING.inOut);
	const parentOp = 1 - c(2.0, 2.8);
	const childOp = c(2.2, 3.0);

	// The child's run — the handoff first, then the familiar choreography.
	const inputMix = c(3.6, 4.0);
	const startBlip = t >= 3.9 && t < 4.4;
	const pulse1 = c(4.3, 4.95);
	const agentLive = t >= 4.9 && t < 5.7;
	const msgGlow = c(4.85, 5.1) * (1 - c(5.5, 5.8));
	const msgMix = c(5.1, 5.5);
	const pulse2 = c(5.7, 6.35);
	const respGlow = c(6.3, 6.55) * (1 - c(6.95, 7.25));
	const respMix = c(6.55, 6.95);
	const respBlip = t >= 6.5 && t < 7.0;

	// Done: settle green in causal order, and HOLD (the freeze-cut out).
	const startOk = t >= 7.6;
	const agentOk = t >= 8.0;
	const respOk = t >= 8.4;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			{parentOp > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: parentOp,
						transform: pushTransform(z),
						transformOrigin: "0 0",
					}}
				>
					<ParentChain
						start={{}}
						wf={{highlighted: true}}
						agent={{}}
						edge1={{}}
						edge2={{}}
						inputMix={1}
						iv={{mix: 1}}
					/>
				</div>
			) : null}

			{childOp > 0 ? (
				<div style={{position: "absolute", inset: 0, opacity: childOp}}>
					<ChildChain
						start={{highlighted: startBlip, state: startOk ? "ok" : "none"}}
						agent={{highlighted: agentLive, state: agentOk ? "ok" : "none"}}
						response={{highlighted: respBlip, state: respOk ? "ok" : "none"}}
						edge1={{}}
						edge2={{}}
						inputMix={inputMix}
						msg={{glow: msgGlow, mix: msgMix}}
						resp={{glow: respGlow, mix: respMix}}
					/>
					<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
					<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
