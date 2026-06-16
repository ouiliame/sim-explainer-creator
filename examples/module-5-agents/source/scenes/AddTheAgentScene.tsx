import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CanvasDots} from "./_local";
import {CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3, TriageChain} from "./_v3";

// v3 scene 2 — change it to use the Agent block. The morph IS the event:
// Route becomes Triage, its tools arrive, and a run starts — the message
// resolves into Start, the pulse reaches the block, the live ring comes
// on… and the moment HOLDS. Scene 3 opens inside it.
export const AddTheAgentScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const morph = interpolate(t, [0.7, 1.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const morphRing = t >= 0.6 && t < 1.7;

	// The agent arrives configured: its tools grow in right after the morph.
	const toolsReveal = interpolate(t, [1.8, 2.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const wrapReveal = interpolate(t, [2.3, 3.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// The run starts — and freezes at the thinking moment.
	const inputMix = interpolate(t, [3.2, 3.55], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const startBlip = t >= 3.4 && t < 3.9;
	const pulse1 = interpolate(t, [3.7, 4.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const agentLive = t >= 4.3; // holds through the cut

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={morph}
				start={{highlighted: startBlip}}
				mid={{highlighted: morphRing || agentLive}}
				inputResolve={{text: "I was charged twice", mix: inputMix}}
				gifts={{
					tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3],
					toolsReveal,
					toolsWrapReveal: wrapReveal,
				}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
		</AbsoluteFill>
	);
};
