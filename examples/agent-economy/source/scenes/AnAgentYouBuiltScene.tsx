import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {clamp01 as c, EconomyRig, runBeats} from "./_rig";

// Scene 1 — an agent you built. The Scout chain assembles on the builder
// canvas (blocks stagger in, edges draw on), then ONE editor run: "Vantra
// Labs" resolves into the Input row, the agent works (Search chip rings),
// and the brief resolves inside the Response Data template. Hold, revert.
// Beat intent: you built a real agent — and it runs when you run it.
export const AnAgentYouBuiltScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const ease = (lo: number, hi: number) =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const blockOp = [ease(0.3, 0.9), ease(0.75, 1.35), ease(1.2, 1.8)];
	const edge1 = ease(1.0, 1.6);
	const edge2 = ease(1.45, 2.05);

	const run = runBeats(t, 3.6, {hold: 1.0});
	// The Search chip rings while the agent works — it called its tool.
	const chipRing = Math.min(c(t, 4.95, 5.2), c(t, 5.6, 5.85, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<EconomyRig
				entry={{opacity: blockOp[0], highlighted: run.startBlip}}
				agent={{opacity: blockOp[1], highlighted: run.midLive}}
				response={{opacity: blockOp[2], highlighted: run.respBlip}}
				edge1={{progress: edge1}}
				edge2={{progress: edge2}}
				searchChipRing={chipRing}
				inputResolve={{text: "Vantra Labs", mix: run.inputMix}}
				msgResolve={{text: "Vantra Labs", mix: run.msgMix}}
				respResolve={{text: '"AI infra, Series B"', mix: run.respMix}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={run.pulse1} len={55} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={run.pulse2} len={55} />
		</AbsoluteFill>
	);
};
