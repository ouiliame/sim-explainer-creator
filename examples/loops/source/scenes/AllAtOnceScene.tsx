import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, Rig} from "./_rig";

// Scene 6 — all at once [run]. Run B, on the Parallel identity. The
// difference from Run A is the schedule: Function 1 fans into THREE
// instances ("a separate instance per item" — the docs' own sentence,
// drawn), the inner Start pill blips ONCE, three pulses leave together,
// all three go live AT THE SAME TIME, each resolves its own item — "x",
// "y", "z" simultaneously — and all settle ok together in about the time
// ONE pass took before. The fan collapses, the container settles, the
// exit fires once, and <parallel.results> resolves to the same collected
// array. Full revert before the cut.
export const AllAtOnceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	const startBlip = t >= 0.4 && t < 0.9;
	const pulse0 = c(0.7, 1.4, 0, 1, EASING.inOut);
	const containerLive = t >= 1.3 && t < 7.5;
	const containerOk = t >= 7.5 && t < 11.2;

	// The fan: instances separate, run, and merge back.
	const fan = c(1.8, 2.8, 0, 1, EASING.inOut) - c(6.5, 7.4, 0, 1, EASING.inOut);

	const pillBlip = Math.min(c(3.0, 3.25), c(3.55, 3.85, 1, 0));
	const pulses = c(3.2, 3.95, 0, 1, EASING.inOut);

	// All three instances share one clock — that synchrony IS the scene.
	const live = t >= 3.85 && t < 5.3;
	const ok = t >= 5.3 && t < 5.95;
	const tagGlow = Math.min(c(3.9, 4.2), c(4.5, 4.8, 1, 0));
	const resolve = Math.min(c(4.15, 4.55), c(5.75, 6.15, 1, 0));
	const inst = (item: number) => ({
		highlighted: live,
		state: ok ? ("ok" as const) : ("none" as const),
		tag: {glow: tagGlow, resolve},
		item,
	});

	const pulseExit = c(7.8, 8.6, 0, 1, EASING.inOut);
	const edgeExitHi = Math.min(c(7.8, 8.2), c(10.4, 11.0, 1, 0));
	const summaryLive = t >= 8.5 && t < 9.7;
	const summaryOk = t >= 9.7 && t < 10.8;
	const resultsGlow = Math.min(c(8.8, 9.1), c(9.5, 9.8, 1, 0));
	const resultsResolve = Math.min(c(9.0, 9.5), c(10.7, 11.3, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Rig
				phase={1}
				start={{highlighted: startBlip}}
				container={{highlighted: containerLive, state: containerOk ? "ok" : "none"}}
				fan={fan}
				fn={inst(1)}
				fnTop={inst(0)}
				fnBot={inst(2)}
				summary={{highlighted: summaryLive, state: summaryOk ? "ok" : "none"}}
				edgeExit={{hi: edgeExitHi}}
				resultsTag={{glow: resultsGlow, resolve: resultsResolve}}
				pillBlip={pillBlip}
				pulse0={pulse0}
				pulseIn={pulses}
				pulseInTop={pulses}
				pulseInBot={pulses}
				pulseExit={pulseExit}
			/>
		</AbsoluteFill>
	);
};
