import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layoutV2";
import {CanvasDots, HIT_SUPPORT, HIT_TOP, KbChain, KbPanel, QUESTION} from "./_shared";

// v2 scene 4 — the closest passages. The Query row's <start.input> resolves
// to the actual question; a comparison blip sweeps every passage (each one
// is measured against the query); the two closest ring selection-blue while
// their source documents ring in sync; everything else recedes. Then the
// aside leaves and the SAME run continues: the ring releases, the pulse
// crosses edge 2, the Agent's live ring comes on — and HOLDS through the
// cut into scene 5.
export const TheClosestPassagesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const queryGlow = interpolate(t, [0.5, 0.9], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const queryMix = interpolate(t, [1.2, 1.9], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// One comparison blip travels the grid in reading order.
	const chunkPulse = (i: number, j: number) => {
		const k = i * 2 + j;
		return interpolate(t, [2.3 + k * 0.14, 2.6 + k * 0.14], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	const select = interpolate(t, [3.6, 4.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const isHit = (i: number, j: number) =>
		(i === HIT_TOP[0] && j === HIT_TOP[1]) || (i === HIT_SUPPORT[0] && j === HIT_SUPPORT[1]);
	const isSourceDoc = (i: number) => i === HIT_TOP[0] || i === HIT_SUPPORT[0];

	// The aside leaves; the run resumes.
	const panelOp = interpolate(t, [6.4, 7.2], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.in,
	});
	const aside = interpolate(t, [6.6, 7.4], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const knowledgeLive = t < 7.4;
	const pulse2 = interpolate(t, [7.7, 8.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const agentLive = t >= 8.3; // holds through the cut

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<KbChain
				start={{dim: aside}}
				knowledge={{highlighted: knowledgeLive}}
				agent={{dim: aside, highlighted: agentLive}}
				edge1={{opacity: 1 - 0.75 * aside}}
				edge2={{opacity: 1 - 0.75 * aside}}
				inputResolve={{text: QUESTION, mix: 1}}
				queryGlow={queryGlow}
				queryResolve={{text: QUESTION, mix: queryMix}}
			/>
			{panelOp > 0 ? (
				<KbPanel
					opacity={panelOp}
					docSlide={1}
					docRing={(i) => (isSourceDoc(i) ? select : 0)}
					docDim={(i) => (isSourceDoc(i) ? 0 : select)}
					chunks={(i, j) => ({
						reveal: 1,
						pulse: chunkPulse(i, j),
						ring: isHit(i, j) ? select : 0,
						dim: isHit(i, j) ? 0 : select,
					})}
				/>
			) : null}
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
		</AbsoluteFill>
	);
};
