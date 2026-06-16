import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BELOW_TILE_POS, blockX, BLOCK_W, CHAIN_EDGE_Y, CHAIN_Y, edgeX1, edgeX2} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_KNOWLEDGE, CHIP_SEARCH, StoreTile, WireDot} from "./_local";

// Scene 7 — memory carries one run into the next. The Memory row appears;
// run 1 deposits a value into the store, run 2 recalls it before answering.
export const MemoryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const memoryReveal = interpolate(t, [0.6, 1.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const tileOp = interpolate(t, [0.8, 1.6, 6.1, 6.8], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Just below the grown block (chips + Skills + Memory rows).
	const AGENT_BOTTOM = CHAIN_Y + 350;
	const TILE_TOP = BELOW_TILE_POS.y;
	const cx = blockX(1) + BLOCK_W / 2;

	const wireDot = (from: number, to: number, i: 0 | 1) => {
		const p = interpolate(t, [from, to], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		const x = interpolate(p, [0, 1], [edgeX1(i) + 4, edgeX2(i) - 4]);
		const op = p <= 0 || p >= 1 ? 0 : p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
		return {x, op};
	};

	// Vertical hop between agent and store (down = deposit, up = recall).
	const hop = (from: number, to: number, down: boolean) => {
		const p = interpolate(t, [from, to], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		if (p <= 0 || p >= 1) return null;
		const y0 = down ? AGENT_BOTTOM : TILE_TOP;
		const y1 = down ? TILE_TOP : AGENT_BOTTOM;
		return {
			y: y0 + (y1 - y0) * p,
			op: p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1,
		};
	};

	// Run 1: in → deposit. Run 2: in → recall → out.
	const in1 = wireDot(1.8, 2.5, 0);
	const deposit = hop(2.9, 3.7, true);
	const depositPulse = interpolate(t, [3.6, 4.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const in2 = wireDot(4.3, 5.0, 0);
	const recall = hop(5.1, 5.9, false);
	const out2 = wireDot(6.1, 6.9, 1);

	const agentLive = (t >= 2.5 && t < 3.0) || (t >= 5.0 && t < 6.1);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<AgentChain
				agent={{highlighted: agentLive}}
				gifts={{
					tools: [CHIP_SEARCH, CHIP_EMAIL, CHIP_KNOWLEDGE],
					skillsReveal: 1,
					memoryReveal,
				}}
			/>
			<StoreTile
				x={BELOW_TILE_POS.x}
				y={BELOW_TILE_POS.y}
				opacity={tileOp}
				pulse={depositPulse}
			/>
			{[in1, in2, out2].map((d, i) =>
				d.op > 0 ? <WireDot key={i} x={d.x} y={CHAIN_EDGE_Y} opacity={d.op} /> : null,
			)}
			{deposit ? <WireDot x={cx} y={deposit.y} opacity={deposit.op * tileOp} /> : null}
			{recall ? <WireDot x={cx} y={recall.y} opacity={recall.op * tileOp} /> : null}
		</AbsoluteFill>
	);
};
