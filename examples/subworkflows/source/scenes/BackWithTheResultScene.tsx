import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2, RAISE_DY} from "../layout";
import {ChildChain, InsidePanel, InsideStem, ParentChain} from "./_local";

// Scene 5 — back with the result. Opens on scene 4's held two-tier frame:
// the call still live above, the completed green child in the panel below.
// The panel folds back up into the Workflow block (the inside returns to
// its container) while the parent glides home — and as it lands, the
// block's ring flips live-blue → ok-green: the call returned. The parent's
// run resumes: the pulse crosses edge 2, <workflow.result> resolves to
// "billing" in the Agent's Messages row, the parent settles green, holds,
// then everything reverts to the resting parent.
// Beat intent: the child's final response comes back as the block's
// result; the parent continues with it like any other value.
export const BackWithTheResultScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, easing?: (n: number) => number): number =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// The return, SEQUENCED so the chain never passes through the open panel:
	// first the panel retracts fully into the block, then the parent glides
	// home.
	const expand = 1 - c(0.6, 1.7, EASING.in);
	const raise = 1 - c(1.7, 2.9, EASING.inOut);

	// The call returns: live ring → ok ring the moment the chain lands.
	const wfOk = t >= 3.0;

	// The run resumes downstream.
	const pulse2 = c(3.5, 4.15);
	const wrGlow = c(3.9, 4.15) * (1 - c(4.55, 4.9));
	const wrMix = c(4.15, 4.55) * (1 - c(7.2, 7.6));
	const agentLive = t >= 4.1 && t < 5.1;

	// Settle green (causal order), hold, then revert to rest.
	const startOk = t >= 5.4 && t < 7.6;
	const agentOk = t >= 5.8 && t < 8.0;
	const wfOkHeld = wfOk && t < 7.8;
	const revert = 1 - c(7.2, 7.6);
	const inputMix = revert;
	const ivMix = revert;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			<InsideStem raise={raise} expand={expand} />
			<InsidePanel expand={expand}>
				<ChildChain
					start={{state: "ok"}}
					agent={{state: "ok"}}
					response={{state: "ok"}}
					edge1={{}}
					edge2={{}}
					inputMix={1}
					msg={{mix: 1}}
					resp={{mix: 1}}
				/>
			</InsidePanel>

			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `translateY(${-RAISE_DY * raise}px)`,
				}}
			>
				<ParentChain
					start={{highlighted: false, state: startOk ? "ok" : "none"}}
					wf={{highlighted: !wfOk, state: wfOkHeld ? "ok" : "none"}}
					agent={{highlighted: agentLive, state: agentOk ? "ok" : "none"}}
					edge1={{}}
					edge2={{}}
					inputMix={inputMix}
					iv={{mix: ivMix}}
					wr={{glow: wrGlow, mix: wrMix}}
				/>
				<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
			</div>
		</AbsoluteFill>
	);
};
