import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {blockX, BLOCK_W, CHAIN_EDGE_Y, CHAIN_Y, edgeX1, edgeX2, SKILL_CARD} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_SEARCH, DataPill, SkillCard, WireDot} from "./_local";

// Scene 5 — skills are guidance, not actions. The Skills row appears; when
// an ambiguous lead arrives, the skill card expands (its name and description
// were always visible) and the loaded rubric flows into the agent.
export const SkillsGuidanceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const skillsReveal = interpolate(t, [0.6, 1.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// An ambiguous lead rides in.
	const pillT = interpolate(t, [1.9, 3.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pillX = interpolate(pillT, [0, 1], [edgeX1(0) + 6, blockX(1) + BLOCK_W / 2]);
	const pillOp =
		pillT <= 0 || pillT >= 0.88
			? 0
			: pillT < 0.1
				? pillT / 0.1
				: pillT > 0.68
					? Math.max(0, (0.88 - pillT) / 0.2)
					: 1;

	// The skill card was docked (name + description); its body loads now.
	const cardOp = interpolate(t, [0.6, 1.5, 7.6, 8.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const bodyReveal = interpolate(t, [3.3, 4.2, 6.4, 7.2], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Guidance flows from the card into the block (dot from card edge to block).
	const flow = (() => {
		const p = interpolate(t, [4.4, 5.4], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		if (p <= 0 || p >= 1) return null;
		const x = interpolate(p, [0, 1], [SKILL_CARD.x + 10, blockX(1) + BLOCK_W - 40]);
		const y = interpolate(p, [0, 1], [SKILL_CARD.y + 60, CHAIN_Y + 170]);
		return {x, y, op: p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1};
	})();

	const agentLive = t >= 3.0 && t < 6.0;
	const agentOk = t >= 6.0 && t < 7.6;

	// The scored result leaves.
	const outT = interpolate(t, [6.6, 7.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const outX = interpolate(outT, [0, 1], [edgeX1(1) + 4, edgeX2(1) - 4]);
	const outOp = outT <= 0 || outT >= 1 ? 0 : outT < 0.2 ? outT / 0.2 : outT > 0.8 ? (1 - outT) / 0.2 : 1;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<AgentChain
				agent={{highlighted: agentLive, state: agentOk ? "ok" : "none"}}
				gifts={{tools: [CHIP_SEARCH, CHIP_EMAIL], skillsReveal}}
			/>
			<SkillCard
				x={SKILL_CARD.x}
				y={SKILL_CARD.y}
				w={SKILL_CARD.w}
				opacity={cardOp}
				bodyReveal={bodyReveal}
			/>
			{pillOp > 0 ? <DataPill text="lead: ???" x={pillX} y={CHAIN_EDGE_Y} opacity={pillOp} /> : null}
			{flow ? <WireDot x={flow.x} y={flow.y} opacity={flow.op} /> : null}
			{outOp > 0 ? <WireDot x={outX} y={CHAIN_EDGE_Y} opacity={outOp} /> : null}
		</AbsoluteFill>
	);
};
