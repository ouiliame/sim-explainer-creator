import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CENTER_X, CENTER_Y, CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CanvasDots} from "./_local";
import {CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3, CHIP_WORKFLOW, TriageChain} from "./_v3";

// v3 scene 6 — still a workflow. One last run walks the chain and everything
// settles green while the camera eases back. Hold the frame.
export const StillAWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const pulse1 = interpolate(t, [1.0, 1.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pulse2 = interpolate(t, [2.4, 3.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const startDone = t >= 1.0;
	const agentLive = t >= 1.7 && t < 2.4;
	const agentDone = t >= 2.4;
	const respDone = t >= 3.2;

	const ease = interpolate(t, [2.6, 4.8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const s = 1 - 0.07 * ease;
	const tx = CENTER_X * (1 - s);
	const ty = CENTER_Y * (1 - s);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `translate(${tx}px, ${ty}px) scale(${s})`,
					transformOrigin: "0 0",
				}}
			>
				<TriageChain
					morph={1}
					start={{state: startDone ? "ok" : "none"}}
					mid={{highlighted: agentLive, state: agentDone ? "ok" : "none"}}
					response={{state: respDone ? "ok" : "none"}}
					gifts={{
						tools: [CHIP_DOCS, CHIP_CRM,
						CHIP_SEARCH_V3, CHIP_WORKFLOW],
						skillsReveal: 1,
					}}
				/>
				<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
				<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
			</div>
		</AbsoluteFill>
	);
};
