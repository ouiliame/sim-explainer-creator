import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {LEAN} from "../layout";
import {Camera, CanvasDots, Rig} from "./_rig";

// Scene 3 — one at a time [run + camera lean-in]. Run A: the ForEach
// mechanism, three times over. The inner Start pill blips, the same pulse
// re-crosses the inner wire, Function 1 goes live, <loop.currentItem>
// resolves in place to the NEXT item ("x" → "y" → "z"), the block settles
// ok, and the pill fires again. Strictly sequential — never two rings at
// once. The camera returns to identity before the cut; the container's
// live ring HOLDS through it (freeze-cut: the passes are done, but the
// loop has produced nothing yet — scene 4 completes this same run).

const ITER_T = [3.2, 5.8, 8.4];

export const OneAtATimeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// Camera: identity → container lean-in, hold through the passes, and
	// back to identity before the cut (only the live ring carries).
	const lean = Math.min(c(1.8, 3.0, 0, 1, EASING.inOut), c(11.6, 12.8, 1, 0, EASING.inOut));
	const px = 960 + (LEAN.px - 960) * lean;
	const py = 540 + (LEAN.py - 540) * lean;
	const s = 1 + (LEAN.s - 1) * lean;

	// The run enters the container once.
	const startBlip = t >= 0.5 && t < 1.0;
	const pulse0 = c(0.8, 1.5, 0, 1, EASING.inOut);
	const containerLive = t >= 1.4; // holds through the scene end (freeze-cut)

	// Which pass is current (windows don't overlap).
	const k = t < ITER_T[1] ? 0 : t < ITER_T[2] ? 1 : 2;
	const T = ITER_T[k];

	const pillBlip = Math.min(c(T, T + 0.25), c(T + 0.55, T + 0.85, 1, 0));
	const pulseIn = c(T + 0.2, T + 0.95, 0, 1, EASING.inOut);
	const fnLive = t >= T + 0.85 && t < T + 1.75;
	const fnOk = t >= T + 1.75 && t < T + 2.35;
	const tagGlow = Math.min(c(T + 0.7, T + 1.0), c(T + 1.3, T + 1.6, 1, 0));
	const resolve = Math.min(c(T + 0.95, T + 1.35), c(T + 1.95, T + 2.35, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Camera px={px} py={py} s={s}>
				<Rig
					phase={0}
					start={{highlighted: startBlip}}
					container={{highlighted: containerLive}}
					fn={{
						highlighted: fnLive,
						state: fnOk ? "ok" : "none",
						tag: {glow: tagGlow, resolve},
						item: k,
					}}
					pillBlip={pillBlip}
					pulse0={pulse0}
					pulseIn={pulseIn}
				/>
			</Camera>
		</AbsoluteFill>
	);
};
