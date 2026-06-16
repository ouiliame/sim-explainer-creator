import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, Rig} from "./_rig";

// Scene 4 — the results come out [freeze-cut completion +
// reference-resolution]. Opens inside the held moment (container still
// live). The container settles ok, its source handle's wire fires ONCE,
// and in Summary's row <loop.results> resolves in place to
// ["x", "y", "z"] — every pass's result, in order, as one value. Hold;
// then everything reverts to template.
export const TheResultsComeOutScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	const containerLive = t < 0.9; // carried in from scene 3
	const containerOk = t >= 0.9 && t < 7.0;

	const pulseExit = c(1.3, 2.1, 0, 1, EASING.inOut);
	const edgeExitHi = Math.min(c(1.3, 1.7), c(6.0, 6.6, 1, 0));

	const summaryLive = t >= 2.0 && t < 3.4;
	const summaryOk = t >= 3.4 && t < 6.6;

	const resultsGlow = Math.min(c(2.3, 2.7), c(3.2, 3.6, 1, 0));
	const resultsResolve = Math.min(c(2.6, 3.1), c(6.2, 6.8, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Rig
				phase={0}
				container={{highlighted: containerLive, state: containerOk ? "ok" : "none"}}
				summary={{highlighted: summaryLive, state: summaryOk ? "ok" : "none"}}
				edgeExit={{hi: edgeExitHi}}
				resultsTag={{glow: resultsGlow, resolve: resultsResolve}}
				pulseExit={pulseExit}
			/>
		</AbsoluteFill>
	);
};
