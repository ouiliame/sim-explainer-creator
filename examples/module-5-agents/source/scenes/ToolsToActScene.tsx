import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {blockX, BLOCK_W, CHAIN_EDGE_Y, CHAIN_Y, edgeX1, edgeX2} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_SEARCH, WireDot} from "./_local";

// Scene 3 — tools let it act. The Tools row grows in with Search and Send
// Email. Three runs: the agent calls Search, then Send Email, then neither —
// which chip lights is the agent's choice, shown by nothing but the ring.
export const ToolsToActScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const toolsReveal = interpolate(t, [0.8, 1.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// One run: dot in → agent live (maybe a chip rings) → dot out.
	const runDot = (from: number, to: number, i: 0 | 1) => {
		const p = interpolate(t, [from, to], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		const x = interpolate(p, [0, 1], [edgeX1(i) + 4, edgeX2(i) - 4]);
		const op = p <= 0 || p >= 1 ? 0 : p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
		return {x, op};
	};

	// Spoke: the tool call leaving the block downward (into the world) and
	// coming back — never toward a neighboring block.
	const spoke = (from: number, to: number) => {
		const p = interpolate(t, [from, to], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		if (p <= 0 || p >= 1) return null;
		const out = p < 0.5 ? p / 0.5 : (1 - p) / 0.5; // 0→1→0
		return {
			x: blockX(1) + BLOCK_W - 80,
			y: CHAIN_Y + 215 + 130 * out,
			op: Math.min(1, out * 3),
		};
	};

	const ringWindow = (from: number, to: number) =>
		interpolate(t, [from, from + 0.3, to, to + 0.4], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	// Runs: 1 → Search rings, 2 → Send Email rings, 3 → neither.
	const in1 = runDot(2.2, 3.0, 0);
	const out1 = runDot(4.4, 5.2, 1);
	const in2 = runDot(5.6, 6.4, 0);
	const out2 = runDot(7.4, 8.2, 1);
	const in3 = runDot(8.6, 9.4, 0);
	const out3 = runDot(9.7, 10.5, 1);

	const searchRing = ringWindow(3.2, 4.2);
	const emailRing = ringWindow(6.6, 7.2);
	const spoke1 = spoke(3.3, 4.3);

	const agentLive =
		(t >= 3.0 && t < 4.4) || (t >= 6.4 && t < 7.4) || (t >= 9.4 && t < 9.7);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<AgentChain
				agent={{highlighted: agentLive}}
				gifts={{
					tools: [
						{...CHIP_SEARCH, ring: searchRing},
						{...CHIP_EMAIL, ring: emailRing},
					],
					toolsReveal,
				}}
			/>
			{[in1, out1, in2, out2, in3, out3].map((d, i) =>
				d.op > 0 ? <WireDot key={i} x={d.x} y={CHAIN_EDGE_Y} opacity={d.op} /> : null,
			)}
			{spoke1 ? <WireDot x={spoke1.x} y={spoke1.y} opacity={spoke1.op} /> : null}
		</AbsoluteFill>
	);
};
