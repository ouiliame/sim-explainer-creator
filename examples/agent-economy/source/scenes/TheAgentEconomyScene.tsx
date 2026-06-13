import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CENTER_X, CENTER_Y, CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {
	clamp01 as c,
	EconomyRig,
	partnerPath,
	PathPulse,
	SLOT_CLAUDE_CODE,
	SLOT_CLAUDE_DESKTOP,
	SLOT_CURSOR,
	SLOT_SIM,
	SLOT_VSCODE,
	spokePath,
	type BadgeVis,
} from "./_rig";

// Scene 6 — the agent economy (bookend). The camera eases back ~7% on the
// full ecosystem: five clients left, the chain center, the partner server
// top-right, the tool identity above the entry. One final run carries BOTH
// directions: Claude Code's call rides in, the chain walks green in causal
// order, and mid-run the pricing_intel chip rings as a pulse goes out to
// the partner and returns — then the reply rides back to Claude Code,
// green. Hold the balanced frame.
// Beat intent: every agent is both a tool and a tool-user — that's the
// agent economy, and your workflow is already in it.
export const TheAgentEconomyScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const ease = interpolate(t, [0.6, 1.9], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const s = 1 - 0.07 * ease;
	const tx = CENTER_X * (1 - s);
	const ty = CENTER_Y * (1 - s);

	// The bookend run (a = 2.8, long middle for the outbound call).
	const a = 2.8;
	const spokeIn = c(t, a - 0.7, a - 0.05);
	const inputMix = c(t, a, a + 0.35);
	const msgMix = c(t, a + 1.05, a + 1.45);
	const pulse1 = c(t, a + 0.5, a + 1.15);
	const midLive = t >= a + 1.1 && t < a + 3.1;
	const chipRing = Math.min(c(t, a + 1.3, a + 1.55), c(t, a + 2.7, a + 2.95, 1, 0));
	const outPulse = c(t, a + 1.5, a + 2.2);
	const backPulse = c(t, a + 2.4, a + 3.1);
	const partnerBlue = Math.min(c(t, a + 1.4, a + 1.7), c(t, a + 2.4, a + 2.7, 1, 0));
	const partnerGreen = Math.min(c(t, a + 3.05, a + 3.3), c(t, a + 3.8, a + 4.3, 1, 0));
	const pulse2 = c(t, a + 3.1, a + 3.75);
	const respStart = a + 3.75;
	const respMix = c(t, respStart, respStart + 0.35);
	const reply = c(t, respStart + 0.55, respStart + 1.2);

	// Green settle, causal order; final state holds (no revert — bookend).
	const entryDone = t >= a + 0.45;
	const agentDone = t >= a + 3.1;
	const respDone = t >= respStart + 0.4;
	const badgeBlue = Math.min(c(t, a - 0.95, a - 0.65), c(t, respStart + 0.55, respStart + 0.85, 1, 0));
	const badgeGreen = c(t, respStart + 1.15, respStart + 1.4);

	const badges: Partial<Record<number, BadgeVis>> = Object.fromEntries(
		[SLOT_CURSOR, SLOT_CLAUDE_CODE, SLOT_CLAUDE_DESKTOP, SLOT_VSCODE, SLOT_SIM].map((slot) => [
			slot,
			{reveal: 1},
		]),
	);
	badges[SLOT_CLAUDE_CODE] = {reveal: 1, blue: badgeBlue, green: badgeGreen};

	const spoke = spokePath(SLOT_CLAUDE_CODE);
	const pp = partnerPath();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `translate(${tx}px, ${ty}px) scale(${s})`,
					transformOrigin: "0 0",
				}}
			>
				<EconomyRig
					entryMix={1}
					entry={{state: entryDone ? "ok" : "none"}}
					agent={{highlighted: midLive && !agentDone, state: agentDone ? "ok" : "none"}}
					response={{state: respDone ? "ok" : "none"}}
					pill={{reveal: 1}}
					showInHandle
					badges={badges}
					spokes={Object.fromEntries(Object.keys(badges).map((slot) => [slot, {progress: 1}]))}
					partner={{reveal: 1, blue: partnerBlue, green: partnerGreen, spoke: {progress: 1}}}
					mcpChip={{reveal: 1, ring: chipRing}}
					inputResolve={{text: "Drift Harbor", mix: inputMix}}
					msgResolve={{text: "Drift Harbor", mix: msgMix}}
					respResolve={{text: '"dev platform"', mix: respMix}}
				/>
				<PathPulse d={spoke.d} len={spoke.len} p={spokeIn} />
				<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} len={55} />
				<PathPulse d={pp.d} len={pp.len} p={outPulse} />
				<PathPulse d={pp.d} len={pp.len} p={backPulse} reverse />
				<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} len={55} />
				<PathPulse d={spoke.d} len={spoke.len} p={reply} reverse />
			</div>
		</AbsoluteFill>
	);
};
