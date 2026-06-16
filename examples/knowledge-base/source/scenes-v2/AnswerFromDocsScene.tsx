import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layoutV2";
import {CanvasDots, KbChain, QUESTION} from "./_shared";

// v2 scene 1 — answer-from-docs. The docs' SUPPORT_KB_WORKFLOW assembles
// (the docs preview's own entrance), then the run starts: the customer's
// question resolves into Start's Input row, the pulse reaches the Knowledge
// block, the live ring comes on — and the moment HOLDS through the cut.
// Scenes 2–4 live inside it.
export const AnswerFromDocsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.45) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The run starts — and freezes at the searching moment.
	const inputMix = interpolate(t, [4.6, 4.95], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const startBlip = t >= 4.8 && t < 5.3;
	const pulse1 = interpolate(t, [5.1, 5.8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const knowledgeLive = t >= 5.7; // holds through the cut

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<KbChain
				start={{opacity: reveal(0.5), highlighted: startBlip}}
				knowledge={{opacity: reveal(1.0), highlighted: knowledgeLive}}
				agent={{opacity: reveal(1.5)}}
				edge1={{progress: reveal(0.9, 0.5)}}
				edge2={{progress: reveal(1.4, 0.5)}}
				inputResolve={{text: QUESTION, mix: inputMix}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
		</AbsoluteFill>
	);
};
