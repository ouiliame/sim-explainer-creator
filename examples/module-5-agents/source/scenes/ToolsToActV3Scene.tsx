import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CanvasDots} from "./_local";
import {CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3, runBeats, TriageChain} from "./_v3";

// v3 scene 3 — give it tools (the REAL run, bird's-eye). Run 1 is the
// charged-twice message: the agent looks up the customer (CRM chip rings)
// and searches the docs (Docs chip rings) — mirroring the real toolCalls —
// then posts billing. Run 2: a thank-you — nothing rings. The calls are the
// agent's choice; the chips ringing ARE the calls.
export const ToolsToActV3Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const toolsReveal = interpolate(t, [0.7, 1.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Run 1 thinks long enough for two calls; run 2 is quick and quiet.
	const run1 = runBeats(t, 2.0, {midDur: 3.2, hold: 0.8});
	const run2 = runBeats(t, 8.8, {midDur: 0.6, hold: 0.7});
	const active = t < 8.7 ? run1 : run2;
	const inputText = t < 8.7 ? "I was charged twice" : "thank you!";
	const respText = t < 8.7 ? "billing — double charge" : "general";

	const ringWindow = (from: number, to: number) =>
		interpolate(t, [from, from + 0.3, to, to + 0.4], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	const crmRing = ringWindow(3.3, 4.3);
	const docsRing = ringWindow(4.7, 5.7);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{highlighted: active.startBlip}}
				mid={{highlighted: active.midLive}}
				response={{highlighted: active.respBlip}}
				inputResolve={{text: inputText, mix: active.inputMix}}
				msgResolve={{text: inputText, mix: active.msgMix}}
				respResolve={{text: respText, mix: active.respMix}}
				gifts={{
					tools: [
						{...CHIP_DOCS, ring: docsRing},
						{...CHIP_CRM, ring: crmRing},
						CHIP_SEARCH_V3,
					],
					toolsReveal,
				}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={active.pulse1} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={active.pulse2} />
		</AbsoluteFill>
	);
};
