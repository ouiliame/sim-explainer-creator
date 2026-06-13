import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {cv, Rig} from "./_rig";

// Scene 6 — the brief comes back [run completion + reference beat]. The
// evidence glows in call order while the agent assembles its answer; the
// agent settles green; the pulse crosses; Response reads the
// <research.content> reference (the JSON template stays — the value is
// the brief the narration describes) and settles green. The settled rings
// HOLD through the cut — the bookend opens on this frame.
export const TheBriefComesBackScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The agent re-reads its evidence, in the order it captured it.
	const glowAt = (a: number) => Math.min(cv(t, a, a + 0.35), cv(t, a + 1.0, a + 1.4, 1, 0));
	const cards: [
		{reveal: number; glow: number},
		{reveal: number; glow: number},
		{reveal: number; glow: number},
		{reveal: number; glow: number},
	] = [
		{reveal: 1, glow: glowAt(0.8)},
		{reveal: 1, glow: glowAt(1.4)},
		{reveal: 1, glow: glowAt(2.0)},
		{reveal: 1, glow: glowAt(2.6)},
	];

	// The run completes in causal order.
	const startOk = t >= 3.5;
	const agentOk = t >= 3.8;
	const pulse2 = cv(t, 4.0, 4.7);
	const respLive = t >= 4.6 && t < 6.4;
	const respGlow = Math.min(cv(t, 4.9, 5.3), cv(t, 6.0, 6.4, 1, 0));
	const respOk = t >= 6.4;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<Rig
				start={{state: startOk ? "ok" : "none"}}
				agent={{highlighted: !agentOk, state: agentOk ? "ok" : "none"}}
				response={{highlighted: respLive, state: respOk ? "ok" : "none"}}
				toolsReveal={1}
				respGlow={respGlow}
				cards={cards}
			/>
			{pulse2 > 0 && pulse2 < 1 ? (
				<WirePulse
					x1={edgeX1(1)}
					x2={edgeX2(1)}
					y={CHAIN_EDGE_Y}
					p={EASING.inOut(pulse2)}
				/>
			) : null}
		</AbsoluteFill>
	);
};
