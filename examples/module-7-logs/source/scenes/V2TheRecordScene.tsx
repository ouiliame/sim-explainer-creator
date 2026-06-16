import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, OutputBundle} from "../../../components";
import {PANEL_MIN_BODY_H, PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout-v2";
import {buildLogRows, TicketChain, triageTree} from "./_v2";

// v2 scene 2 — the record. The chain performs its single glide to the top
// and dims; the OutputBundle (the docs' own run-inspector) rises beneath it.
// The four log rows reveal in run order with their REAL durations; Triage's
// row arrives selected and its output tree reveals. The 12.2s duration
// glows briefly — the record already shows where the time went.
// Enter contract (← scene 1): chain center-framed, template, no panel.
// Exit contract (→ scene 3): chain top + dim; panel up; rows revealed;
// Triage selected; full tree; Output tab; zero highlights.
export const V2TheRecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const clamp = (lo: number, hi: number, l2 = 0, h2 = 1, easing = EASING.out) =>
		interpolate(t, [lo, hi], [l2, h2], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// The ONE glide of the whole video (interpolated, never cut).
	const glide = clamp(0.3, 1.7, 0, 1, EASING.inOut);
	const dim = clamp(0.7, 1.9, 0, 1, EASING.inOut);

	const panelOp = clamp(1.4, 2.2);
	const panelRise = (1 - panelOp) * 30;

	const rowReveal = (i: number) => clamp(2.2 + i * 0.3, 2.6 + i * 0.3);
	const triSelected = clamp(3.6, 4.0);
	const treeReveal = (i: number) => clamp(4.2 + i * 0.35, 4.7 + i * 0.35);

	// Where the time went: the 12.2s glows, then releases before the cut.
	const durGlow = interpolate(t, [6.6, 7.2, 8.6, 9.3], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TicketChain
				glide={glide}
				start={{dim}}
				triage={{dim}}
				build={{dim}}
				ticket={{dim}}
				edges={[
					{opacity: 1 - 0.65 * dim},
					{opacity: 1 - 0.65 * dim},
					{opacity: 1 - 0.65 * dim},
				]}
			/>

			{panelOp > 0 ? (
				<div style={{position: "absolute", left: PANEL_X, top: PANEL_Y + panelRise}}>
					<OutputBundle
						scale={PANEL_SCALE}
						opacity={panelOp}
						minBodyH={PANEL_MIN_BODY_H}
						logs={buildLogRows({
							reveals: [rowReveal(0), rowReveal(1), rowReveal(2), rowReveal(3)],
							selected: [0, triSelected, 0, 0],
							triageDurationGlow: durGlow,
						})}
						values={triageTree({
							reveals: [treeReveal(0), treeReveal(1), treeReveal(2)],
						})}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
