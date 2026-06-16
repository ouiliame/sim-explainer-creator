import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {blockX, CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_KNOWLEDGE, CHIP_SEARCH, MiniBundle, WireDot} from "./_local";

// Scene 8 — structured output: a typed result later blocks can act on. The
// Response Format row appears; the run's output is a typed bundle riding to
// Response, whose Data row reads <agent.score>.
export const StructuredOutputScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const rfReveal = interpolate(t, [0.6, 1.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const inDot = (() => {
		const p = interpolate(t, [1.9, 2.7], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		const x = interpolate(p, [0, 1], [edgeX1(0) + 4, edgeX2(0) - 4]);
		const op = p <= 0 || p >= 1 ? 0 : p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
		return {x, op};
	})();

	const agentLive = t >= 2.7 && t < 3.8;

	// The typed bundle rides the wire and is absorbed into Response.
	const bundleT = interpolate(t, [3.9, 5.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const bundleX = interpolate(bundleT, [0, 1], [edgeX1(1) + 20, blockX(2) + 60]);
	// Absorbed at the Response boundary — never parked over its rows.
	const bundleOp =
		bundleT <= 0 || bundleT >= 0.8
			? 0
			: bundleT < 0.12
				? bundleT / 0.12
				: bundleT > 0.55
					? Math.max(0, (0.8 - bundleT) / 0.25)
					: 1;
	const edge2Hi = interpolate(t, [3.9, 4.2, 5.3, 5.8], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const glowResp = interpolate(t, [5.0, 5.6, 6.8, 7.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const respOk = t >= 5.6 && t < 7.2;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<AgentChain
				agent={{highlighted: agentLive}}
				response={{state: respOk ? "ok" : "none"}}
				edge2={{hi: edge2Hi}}
				tagGlowResp={glowResp}
				gifts={{
					tools: [CHIP_SEARCH, CHIP_EMAIL, CHIP_KNOWLEDGE],
					skillsReveal: 1,
					memoryReveal: 1,
					rfReveal,
				}}
			/>
			{inDot.op > 0 ? <WireDot x={inDot.x} y={CHAIN_EDGE_Y} opacity={inDot.op} /> : null}
			{bundleOp > 0 ? (
				<MiniBundle x={bundleX} y={CHAIN_EDGE_Y + 56} opacity={bundleOp} scale={1 - 0.25 * bundleT} />
			) : null}
		</AbsoluteFill>
	);
};
