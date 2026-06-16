import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {AgentGlyphW, OutputBundle, RouterGlyphW, StartGlyphW} from "../../../components";
import {BUNDLE_SCALE, BUNDLE_X, BUNDLE_Y} from "../layout";
import {CanvasDots, Fork} from "./_fork";

// Scene 6 — the run record [record-panel]. Run C's record over the dimmed,
// unmoved fork: THREE log rows — five blocks on the canvas, three in the
// log. No Sales row, no Billing row, ever; the absence is the beat, so the
// column holds still after the third row lands. The Router row carries the
// product's active-row background (a highlight state, never a word). Log
// durations and the reasoning string are pending artifacts — durations are
// omitted rather than invented; the output shows only the doc-authored
// selectedRoute, as scenery.
export const TheRunRecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const dim = interpolate(t, [0.4, 1.1, 6.8, 7.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const panelOp = interpolate(t, [0.9, 1.7, 6.6, 7.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const panelY = BUNDLE_Y + (1 - Math.min(1, panelOp)) * 30;

	const reveal = (t0: number) =>
		interpolate(t, [t0, t0 + 0.4], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Fork
				phase={1}
				start={{dim}}
				decider={{dim}}
				destA={{dim}}
				destB={{dim}}
				destC={{dim}}
				edge0={{opacity: 1 - 0.65 * dim}}
				edgeA={{opacity: 1 - 0.65 * dim}}
				edgeB={{opacity: 1 - 0.65 * dim}}
				edgeC={{opacity: 1 - 0.65 * dim}}
			/>

			{panelOp > 0 ? (
				<div style={{position: "absolute", left: BUNDLE_X, top: panelY}}>
					<OutputBundle
						scale={BUNDLE_SCALE}
						opacity={panelOp}
						logs={[
							{
								name: "Start",
								color: "#2FB3FF",
								glyph: <StartGlyphW size={11} />,
								reveal: reveal(1.7),
							},
							{
								name: "Router",
								color: "#28C43F",
								glyph: <RouterGlyphW size={11} />,
								selected: true,
								reveal: reveal(2.1),
							},
							{
								name: "Support",
								color: "#33C482",
								glyph: <AgentGlyphW size={11} />,
								reveal: reveal(2.5),
							},
						]}
						values={[
							{
								key: "selectedRoute",
								type: "string",
								value: "support",
								reveal: reveal(3.1),
							},
						]}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
