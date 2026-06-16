import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {runBeats, TriageChain, CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3} from "../../module-5-agents/scenes/_v3";

// Scene 1 — a tool in action. The module-5 Triage chain assembles and the
// real run replays compressed: input resolves, the agent goes live, and the
// CRM chip rings — the real customerLookup call (triage-run.md, 375ms). The
// viewer has seen this exact moment before; this video is about what that
// chip IS. Everything reverts to template rest before the cut.
export const AToolInActionScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.45) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// One run, with a longer thinking window so the tool call reads.
	const run = runBeats(t, 2.8, {midDur: 2.4, hold: 0.6});

	// The CRM chip rings while the agent is live — the customerLookup call.
	const crmRing = interpolate(t, [4.3, 4.6, 5.6, 6.0], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{opacity: reveal(0.5), highlighted: run.startBlip}}
				mid={{opacity: reveal(1.0), highlighted: run.midLive}}
				response={{opacity: reveal(1.5), highlighted: run.respBlip}}
				edge1={{progress: reveal(0.9, 0.5)}}
				edge2={{progress: reveal(1.4, 0.5)}}
				inputResolve={{text: "I was charged twice", mix: run.inputMix}}
				msgResolve={{text: "I was charged twice", mix: run.msgMix}}
				respResolve={{text: "billing — double charge", mix: run.respMix}}
				gifts={{
					tools: [CHIP_DOCS, {...CHIP_CRM, ring: crmRing}, CHIP_SEARCH_V3],
					toolsReveal: reveal(1.0),
				}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={run.pulse1} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={run.pulse2} />
		</AbsoluteFill>
	);
};
