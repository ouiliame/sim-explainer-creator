import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ConfigCard} from "./_config";
import {CanvasDots, Rig} from "./_rig";

// Scene 2 — what the loop knows [zoom-aside]. The container takes the
// selection ring (editing); the rest of the world dims; the product's own
// editor card slides in: Loop Type → For Each, Collection Items →
// ["x", "y", "z"]. The three items glow in sequence — a countable
// collection. Card leaves; ring releases; world undims.
export const WhatTheLoopKnowsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	const dim = Math.min(c(0.5, 1.0), c(6.8, 7.4, 1, 0));
	const ring = t >= 0.5 && t < 7.0;

	const cardOp = Math.min(c(1.0, 1.6), c(6.2, 6.8, 1, 0));
	const slide = 1 - c(1.0, 1.7, 0, 1, EASING.out) + c(6.2, 6.8, 0, 1, EASING.in);

	const typeGlow = Math.min(c(2.0, 2.4), c(2.8, 3.2, 1, 0));
	const itemGlow = (T: number) => Math.min(c(T, T + 0.35), c(T + 0.8, T + 1.15, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Rig
				phase={0}
				start={{dim}}
				summary={{dim}}
				container={{highlighted: ring}}
				edge0={{opacity: 1 - 0.65 * dim}}
				edgeExit={{opacity: 1 - 0.65 * dim}}
			/>
			<ConfigCard
				opacity={cardOp}
				slide={slide}
				typeGlow={typeGlow}
				itemGlows={[itemGlow(3.4), itemGlow(4.4), itemGlow(5.4)]}
			/>
		</AbsoluteFill>
	);
};
