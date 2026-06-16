import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS} from "../../../theme";
import {CanvasDots, OutputBundle, type OutputNode} from "../../../components";
import {PANEL_MIN_BODY_H, PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout-v2";
import {
	buildLogRows,
	buildRowInputTree,
	logTicketInputTree,
	startOutputTree,
	TicketChain,
	triageInputTree,
	triageTree,
} from "./_v2";

// v2 scene 4 — THE centerpiece: read the record backwards. Selection jumps
// to LogTicket and the Input tab takes the emphasis: data resolved from
// <buildRow.result> — "billing" holds a provenance glow. The reference names
// its producer, so selection steps LEFT: BuildRow's input was
// <triage.content>; Triage's input was <start.message>; Start is the
// source. The blue ring walks the chain right-to-left in sync with the log
// rows; the chain row's own tag resolves together with the panel's (the
// two-surface synchrony device). Everything reverts before the cut.
// Enter/exit contract: identical to scene 3's exit (Triage selected,
// Output tab, full tree, uniform dim, zero highlights).
export const V2ReadItBackwardsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, l2 = 0, h2 = 1) =>
		interpolate(t, [lo, hi], [l2, h2], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const window = (lo: number, hi: number, ramp = 0.45) =>
		interpolate(t, [lo, lo + ramp, hi - ramp, hi], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	// The five selection moves (each 0→1, strictly sequential).
	const m1 = c(0.8, 1.4); // Triage → LogTicket
	const m2 = c(5.0, 5.6); // LogTicket → BuildRow
	const m3 = c(9.2, 9.8); // BuildRow → Triage
	const m4 = c(13.4, 14.0); // Triage → Start
	const m5 = c(16.6, 17.2); // Start → Triage (revert)

	// Per-row selection mixes (non-overlapping by construction).
	const selTicket = m1 - m2;
	const selBuild = m2 - m3;
	const selTriageStep = m3 - m4;
	const selStart = m4 - m5;
	const selTriage = 1 - m1 + selTriageStep + m5;

	// Input tab holds the emphasis for the whole backward walk.
	const inputTab = interpolate(t, [1.2, 1.9, 13.8, 14.5], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// ── Step 1 · LogTicket ────────────────────────────────────────────────
	const ltOp = interpolate(t, [1.3, 1.7, 5.0, 5.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const ltGlow = window(1.9, 3.4);
	const ltResolve = Math.min(c(2.6, 3.1), c(4.9, 5.3, 1, 0));
	const ltBilling = window(3.3, 5.0);

	// ── Step 2 · BuildRow ─────────────────────────────────────────────────
	const brOp = interpolate(t, [5.5, 5.9, 9.2, 9.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const brGlow = window(6.1, 7.6);
	const brResolve = Math.min(c(6.8, 7.3), c(9.1, 9.5, 1, 0));
	const brBilling = window(7.5, 9.2);

	// ── Step 3 · Triage ───────────────────────────────────────────────────
	const triOp = interpolate(t, [9.7, 10.1, 13.4, 13.8], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const triGlow = window(10.3, 11.8);
	const triResolve = Math.min(c(11.0, 11.5), c(13.3, 13.7, 1, 0));

	// ── Step 4 · Start (the source) ───────────────────────────────────────
	const startOp = interpolate(t, [13.9, 14.3, 16.6, 17.0], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const startResolve = Math.min(c(14.0, 14.4), c(16.5, 16.9, 1, 0));

	// ── Revert: the full Triage bundle returns ────────────────────────────
	const fullOp = Math.max(1 - c(0.8, 1.2), c(17.1, 17.5));

	// Only the active tree's nodes are mounted (no overlap by construction).
	let values: OutputNode[] = [];
	if (fullOp > 0) values = triageTree({opacity: fullOp});
	else if (ltOp > 0)
		values = logTicketInputTree({
			opacity: ltOp,
			tagGlow: ltGlow,
			resolve: ltResolve,
			billingGlow: ltBilling,
		});
	else if (brOp > 0)
		values = buildRowInputTree({
			opacity: brOp,
			tagGlow: brGlow,
			resolve: brResolve,
			billingGlow: brBilling,
		});
	else if (triOp > 0)
		values = triageInputTree({opacity: triOp, tagGlow: triGlow, resolve: triResolve});
	else if (startOp > 0) values = startOutputTree({opacity: startOp});

	// The blue ring walks the chain right-to-left with the selection.
	const ringOn = (sel: number) => sel > 0.5;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TicketChain
				glide={1}
				start={{dim: 1 - 0.7 * selStart, highlighted: ringOn(selStart)}}
				triage={{dim: 1 - 0.7 * selTriageStep, highlighted: ringOn(selTriageStep)}}
				build={{dim: 1 - 0.7 * selBuild, highlighted: ringOn(selBuild)}}
				ticket={{dim: 1 - 0.7 * selTicket, highlighted: ringOn(selTicket)}}
				edges={[{opacity: 0.35}, {opacity: 0.35}, {opacity: 0.35}]}
				// Two-surface synchrony: the block row's tag resolves with the panel's.
				dataResolve={ltResolve}
				dataGlow={ltBilling}
				msgResolve={triResolve}
				msgGlow={triGlow * (1 - triResolve)}
				inputResolve={startResolve}
			/>

			<div style={{position: "absolute", left: PANEL_X, top: PANEL_Y}}>
				<OutputBundle
					scale={PANEL_SCALE}
					opacity={1}
					minBodyH={PANEL_MIN_BODY_H}
					inputTab={inputTab}
					logs={buildLogRows({
						selected: [selStart, selTriage, selBuild, selTicket],
					})}
					values={values}
				/>
			</div>
		</AbsoluteFill>
	);
};
