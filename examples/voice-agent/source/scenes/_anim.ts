// Per-scene animation helpers (Phase B). House idiom: local-seconds clock +
// a clamped-interpolate helper (the loops/approvals pattern), plus the two
// pieces this video's continuity contract needs:
//
//   • gf — the video-GLOBAL oscillator frame. Waveforms and live dots are
//     continuous shimmer; deriving their phase from gf (local frame + the
//     scene's start offset, vo-timing aware) keeps the shimmer continuous
//     across every cut, in the master comp and in standalone scene comps.
//
//   • q — the quiet gate, 0 exactly at both boundary frames of a scene and
//     1 inside it. Oscillating surfaces (waveform amplitude, dot pulse)
//     multiply by q, so every cut lands on a settled frame and
//     verify-boundaries reads IDENTICAL. The dip reads as a natural lull
//     between conversation turns.

import {interpolate} from "remotion";
import {FPS, seconds} from "../../../theme";
import type {Cam} from "../layout";
import {sceneFrames, sceneStartFrames, type SceneName} from "../timing";

/** Clamped interpolate over local seconds (the loops `c` helper). */
export const mkClock = (frame: number) => {
	const t = frame / FPS;
	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});
	return {t, c};
};

/** Global oscillator frame + boundary quiet gate for a scene. */
export const sceneClock = (name: SceneName, frame: number) => {
	const gf = frame + sceneStartFrames(name);
	const last = sceneFrames(name) - 1;
	const ramp = seconds(0.5);
	const q = Math.min(
		interpolate(frame, [0, ramp], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}),
		interpolate(frame, [last - ramp, last], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}),
	);
	return {gf, q};
};

/** Linear camera mix — drive p with EASING.inOut (camera-move rule). */
export const camMix = (a: Cam, b: Cam, p: number): Cam => ({
	px: a.px + (b.px - a.px) * p,
	py: a.py + (b.py - a.py) * p,
	s: a.s + (b.s - a.s) * p,
});
