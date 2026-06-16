import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, OutputBundle} from "../../../components";
import {PANEL_MIN_BODY_H, PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout-v2";
import {buildLogRows, TicketChain, triageTree} from "./_v2";

// v2 scene 5 — every run writes one. The chain undims to full; then the
// recap pulse: each log row pulses top→bottom while its block rings green
// left→right, in causal order — the list IS the run (re-reading the SAME
// run, not running again). The green rings hold to the final frame: the
// chain above, its record below, at rest.
// Enter contract (← scene 4): Triage selected, Output tab, full tree,
// uniform dim, zero highlights.
export const V2EveryRunWritesOneScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const undim = interpolate(t, [0.5, 1.6], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// The recap: row i pulses as block i settles green, in run order.
	const beat = (i: number) => 2.2 + i * 0.75;
	const rowPulse = (i: number) =>
		interpolate(t, [beat(i), beat(i) + 0.3, beat(i) + 0.7, beat(i) + 1.0], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	const blockOk = (i: number) => t >= beat(i) + 0.15;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TicketChain
				glide={1}
				start={{dim: undim, state: blockOk(0) ? "ok" : "none"}}
				triage={{dim: undim, state: blockOk(1) ? "ok" : "none"}}
				build={{dim: undim, state: blockOk(2) ? "ok" : "none"}}
				ticket={{dim: undim, state: blockOk(3) ? "ok" : "none"}}
				edges={[
					{opacity: 1 - 0.65 * undim},
					{opacity: 1 - 0.65 * undim},
					{opacity: 1 - 0.65 * undim},
				]}
			/>

			<div style={{position: "absolute", left: PANEL_X, top: PANEL_Y}}>
				<OutputBundle
					scale={PANEL_SCALE}
					opacity={1}
					minBodyH={PANEL_MIN_BODY_H}
					logs={buildLogRows({
						// Triage's row stays selected (the held view); the others pulse.
						selected: [rowPulse(0), 1, rowPulse(2), rowPulse(3)],
					})}
					values={triageTree({})}
				/>
			</div>
		</AbsoluteFill>
	);
};
