import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CENTER_X, CENTER_Y, CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CHIP_WEATHER} from "./_local";
import {TriageChain, CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3} from "../../module-5-agents/scenes/_v3";

// Scene 5 — the agent decides. One final run walks the chain with four
// chips on the table: the CRM chip rings (the model reaches for what THIS
// message needs — the new Weather chip sits quiet; relevance is its call),
// blocks settle green in causal order, camera eases back. Hold.
export const TheAgentDecidesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const pulse1 = interpolate(t, [1.0, 1.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pulse2 = interpolate(t, [3.0, 3.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const startDone = t >= 1.0;
	const agentLive = t >= 1.7 && t < 3.0;
	const agentDone = t >= 3.0;
	const respDone = t >= 3.8;

	// The model picks its tool: the CRM chip rings inside the live window.
	const crmRing = interpolate(t, [1.9, 2.2, 2.7, 3.0], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const ease = interpolate(t, [3.2, 5.4], [0, 1], {
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
						tools: [CHIP_DOCS, {...CHIP_CRM, ring: crmRing}, CHIP_SEARCH_V3, CHIP_WEATHER],
					}}
				/>
				<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
				<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
			</div>
		</AbsoluteFill>
	);
};
