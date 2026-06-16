import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CanvasDots} from "./_local";
import {runBeats, TriageChain} from "./_v3";

// v3 scene 1 — a normal workflow, no agent. A keyword router triages support
// messages. Run 1: "I want a refund" routes to billing — the rule works.
// Run 2: "I was charged twice" — no keyword, lands in general. Nothing
// fails; the rule just can't read.
//
// Data never rides the wires: the message resolves in Start's Input row, a
// light pulse crosses, and the category resolves in Response's Data row.
export const AWorkingWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.45) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const run1 = runBeats(t, 2.9);
	const run2 = runBeats(t, 7.0);
	const active = t < 6.9 ? run1 : run2;
	const inputText = t < 6.9 ? "I want a refund" : "I was charged twice";
	const respText = t < 6.9 ? "billing" : "general";

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={0}
				start={{opacity: reveal(0.5), highlighted: active.startBlip}}
				mid={{opacity: reveal(1.0), highlighted: active.midLive}}
				response={{opacity: reveal(1.5), highlighted: active.respBlip}}
				edge1={{progress: reveal(0.9, 0.5)}}
				edge2={{progress: reveal(1.4, 0.5)}}
				inputResolve={{text: inputText, mix: active.inputMix}}
				respResolve={{text: respText, mix: active.respMix}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={active.pulse1} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={active.pulse2} />
		</AbsoluteFill>
	);
};
