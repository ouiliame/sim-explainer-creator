import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {BELOW_TILE, BELOW_TILE_POS, blockX, BLOCK_W, CHAIN_Y} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_KNOWLEDGE, CHIP_SEARCH, DataPill, WireDot} from "./_local";

// Scene 6 — knowledge grounds it in your documents. A Knowledge chip joins
// the tools (the wrap line opens smoothly); the agent queries the knowledge
// base below and matched chunks ride back up.
export const KnowledgeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const wrapReveal = interpolate(t, [0.6, 1.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const tileOp = interpolate(t, [0.8, 1.6, 5.9, 6.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Just below the grown block (3 chips on two lines + Skills row).
	const AGENT_BOTTOM = CHAIN_Y + 315;
	const TILE_TOP = BELOW_TILE_POS.y;
	const cx = blockX(1) + BLOCK_W / 2;

	// Query down, two chunks up.
	const queryT = interpolate(t, [2.2, 3.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const queryOp = queryT <= 0 || queryT >= 1 ? 0 : queryT < 0.2 ? queryT / 0.2 : queryT > 0.8 ? (1 - queryT) / 0.2 : 1;

	const chunk = (from: number, dx: number) => {
		const p = interpolate(t, [from, from + 0.9], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		if (p <= 0 || p >= 0.92) return null;
		return {
			x: cx + dx,
			y: TILE_TOP + (AGENT_BOTTOM - TILE_TOP) * (1 - p),
			op: p < 0.15 ? p / 0.15 : p > 0.72 ? Math.max(0, (0.92 - p) / 0.2) : 1,
		};
	};
	const chunk1 = chunk(3.4, -60);
	const chunk2 = chunk(3.7, 70);

	const agentLive = t >= 2.0 && t < 4.6;
	const agentOk = t >= 4.6 && t < 6.2;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<AgentChain
				agent={{highlighted: agentLive, state: agentOk ? "ok" : "none"}}
				gifts={{
					tools: [CHIP_SEARCH, CHIP_EMAIL, {...CHIP_KNOWLEDGE, opacity: wrapReveal}],
					toolsWrapReveal: wrapReveal,
					skillsReveal: 1,
				}}
			/>
			<div style={{position: "absolute", left: BELOW_TILE_POS.x, top: BELOW_TILE_POS.y, opacity: tileOp}}>
				<ObjectNode kind="knowledge" label="Past deals" layout="row" width={BELOW_TILE.w} height={BELOW_TILE.h} />
			</div>
			{queryOp > 0 ? (
				<WireDot x={cx} y={AGENT_BOTTOM + (TILE_TOP - AGENT_BOTTOM) * queryT} opacity={queryOp * tileOp} />
			) : null}
			{chunk1 ? (
				<DataPill text="won · Acme" x={chunk1.x - 60} y={chunk1.y} opacity={chunk1.op * tileOp} scale={0.8} />
			) : null}
			{chunk2 ? (
				<DataPill text="won · Initech" x={chunk2.x + 60} y={chunk2.y} opacity={chunk2.op * tileOp} scale={0.8} />
			) : null}
		</AbsoluteFill>
	);
};
