import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CanvasDots} from "./_local";
import {runBeats, TriageChain} from "./_v3";

// v3 scene 1 — a normal workflow. The Route chain assembles and one quick
// run crosses it. This is scenery, not an argument: it orients from the
// known and establishes what "running" looks like before the agent arrives.
export const ANormalWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.45) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const run = runBeats(t, 2.7, {hold: 0.3});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={0}
				start={{opacity: reveal(0.5), highlighted: run.startBlip}}
				mid={{opacity: reveal(1.0), highlighted: run.midLive}}
				response={{opacity: reveal(1.5), highlighted: run.respBlip}}
				edge1={{progress: reveal(0.9, 0.5)}}
				edge2={{progress: reveal(1.4, 0.5)}}
				inputResolve={{text: "I want a refund", mix: run.inputMix}}
				respResolve={{text: "billing", mix: run.respMix}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={run.pulse1} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={run.pulse2} />
		</AbsoluteFill>
	);
};
