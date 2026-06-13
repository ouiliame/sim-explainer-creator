import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse, popIn} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {
	clamp01 as c,
	EconomyRig,
	partnerPath,
	PathPulse,
	runBeats,
	SLOT_CLAUDE_CODE,
	SLOT_CLAUDE_DESKTOP,
	SLOT_CURSOR,
	SLOT_SIM,
	SLOT_VSCODE,
} from "./_rig";

// Scene 5 — you call theirs. The focus flips: callers and entry dim; the
// Agent is focal. A partner server pops top-right (pricing_intel — someone
// else's deployed workflow, the product's MCP chip identity) and a spoke
// draws from the Agent's source handle up to it. The Agent's Tools row
// grows a third chip, pricing_intel. Then one editor run: while the agent
// works, the NEW chip rings and a pulse rides the partner spoke out and
// back — their agent running somewhere else — and the brief resolves.
// Beat intent: the protocol is symmetric — someone else's deployed agent
// is now a tool inside yours.
export const YouCallTheirsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const dimIn = interpolate(t, [0.4, 1.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const dimOut = interpolate(t, [10.6, 11.3], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const dimAmt = dimIn * dimOut;

	const partnerReveal = popIn(frame, fps, 1.2);
	const partnerSpoke = interpolate(t, [1.9, 2.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const chipReveal = interpolate(t, [2.8, 3.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// One run, editor-origin, with a long middle: the agent's work IS the
	// outbound tool call.
	const run = runBeats(t, 4.6, {midDur: 2.4, hold: 1.0});
	const chipRing = Math.min(c(t, 5.9, 6.15), c(t, 7.7, 7.95, 1, 0));
	const outPulse = c(t, 6.1, 6.8);
	const backPulse = c(t, 7.0, 7.7);
	const partnerBlue = Math.min(c(t, 6.0, 6.3), c(t, 7.0, 7.3, 1, 0));
	const partnerGreen = Math.min(c(t, 7.65, 7.9), c(t, 8.4, 8.9, 1, 0));

	const pp = partnerPath();
	const dimmedBadges = Object.fromEntries(
		[SLOT_CURSOR, SLOT_CLAUDE_CODE, SLOT_CLAUDE_DESKTOP, SLOT_VSCODE, SLOT_SIM].map((s) => [
			s,
			{reveal: 1, dim: dimAmt},
		]),
	);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<EconomyRig
				entryMix={1}
				entry={{dim: dimAmt}}
				agent={{highlighted: run.midLive}}
				response={{dim: dimAmt, highlighted: run.respBlip}}
				edge1={{opacity: 1 - 0.45 * dimAmt}}
				edge2={{opacity: 1 - 0.45 * dimAmt}}
				pill={{reveal: 1, dimmed: dimAmt}}
				showInHandle
				badges={dimmedBadges}
				spokes={Object.fromEntries(
					Object.keys(dimmedBadges).map((s) => [s, {progress: 1, opacity: 1 - 0.45 * dimAmt}]),
				)}
				partner={{
					reveal: partnerReveal,
					blue: partnerBlue,
					green: partnerGreen,
					spoke: {progress: partnerSpoke},
				}}
				mcpChip={{reveal: chipReveal, ring: chipRing}}
				inputResolve={{text: "Octave Systems", mix: run.inputMix}}
				msgResolve={{text: "Octave Systems", mix: run.msgMix}}
				respResolve={{text: '"voice agents"', mix: run.respMix}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={run.pulse1} len={55} />
			<PathPulse d={pp.d} len={pp.len} p={outPulse} />
			<PathPulse d={pp.d} len={pp.len} p={backPulse} reverse />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={run.pulse2} len={55} />
		</AbsoluteFill>
	);
};
