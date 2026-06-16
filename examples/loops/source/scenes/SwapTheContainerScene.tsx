import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, Rig} from "./_rig";

// Scene 5 — swap the container [morph-swap]. Selection ring (editing);
// one continuous morph at constant geometry: chip #2FB3FF Repeat →
// #FEE12B Split (glyph goes dark per the product's luminance rule), name
// Loop → Parallel, and the two reference tags dip in sync
// (<loop.currentItem> → <parallel.currentItem>, <loop.results> →
// <parallel.results>). NOTHING else changes — same box, same inner block,
// same wires, same items. That stillness is the lesson.
export const SwapTheContainerScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	const ring = t >= 0.6 && t < 6.6;
	const phase = c(1.4, 5.4, 0, 1, EASING.inOut);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Rig phase={phase} container={{highlighted: ring}} />
		</AbsoluteFill>
	);
};
