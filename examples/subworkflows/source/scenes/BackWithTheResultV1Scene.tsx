import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2, foldTransform, pushTransform, SLOT_BLOCK_CENTER} from "../layout";
import {ChildChain, ParentChain} from "./_local";

// Scene 5 (ORIGINAL v1 take — fold-back; superseded by the accepted
// expand-beneath cut in BackWithTheResultScene.tsx). Opens inside scene 4's held moment: the
// completed, green child at identity. The camera pulls back out — the child
// world folds into the Workflow block — and as it lands the block's ring
// flips live-blue → ok-green: the call returned. The parent's run resumes:
// the pulse crosses edge 2, <workflow.result> resolves to "billing" in the
// Agent's Messages row, the parent settles green, holds, then everything
// reverts to the resting parent.
// Beat intent: the child's final response comes back as the block's
// result; the parent continues with it like any other value.
export const BackWithTheResultV1Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, easing?: (n: number) => number): number =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// The pull-out: one camera move, two layers — the parent returns from
	// the pushed-in framing while the child folds into the block footprint.
	const out = c(0.6, 2.8, EASING.inOut);
	const z = 1 - out;
	const parentOp = c(0.9, 1.7);
	const childOp = 1 - c(1.8, 2.6);

	// The call returns: live ring → ok ring the moment the fold lands.
	const wfOk = t >= 2.7;

	// The run resumes downstream.
	const pulse2 = c(3.3, 3.95);
	const wrGlow = c(3.7, 3.95) * (1 - c(4.35, 4.7));
	const wrMix = c(3.95, 4.35) * (1 - c(7.2, 7.6));
	const agentLive = t >= 3.9 && t < 4.9;

	// Settle green (causal order), hold, then revert to rest.
	const startOk = t >= 5.2 && t < 7.6;
	const agentOk = t >= 5.6 && t < 8.0;
	const wfOkHeld = wfOk && t < 7.8;
	const revert = 1 - c(7.2, 7.6);
	const inputMix = revert;
	const ivMix = revert;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			{childOp > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: childOp,
						transform: foldTransform(SLOT_BLOCK_CENTER, out),
						transformOrigin: "0 0",
					}}
				>
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
				</div>
			) : null}

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
			) : null}
		</AbsoluteFill>
	);
};
