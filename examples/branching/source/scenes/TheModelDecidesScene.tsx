import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {LEAN} from "../layout";
import {Camera, CanvasDots, Fork} from "./_fork";

// Scene 5 — the model decides [run + lean-in]. Run C: the Context tag glows
// (the Router is READING it — the raw ticket text is a pending artifact, so
// the reference never substitutes), then the Model row glows ~1.4s while
// the live ring HOLDS — a visible beat of thought, deliberately longer than
// the Condition's instant verdict. The timing contrast is the wordless
// lesson. Then the Support route fires and only its lane runs.
export const TheModelDecidesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// Camera: identity → LEAN for the decision, back before the scene ends.
	const lean =
		c(1.4, 2.8, 0, 1, EASING.inOut) - c(9.8, 11.2, 0, 1, EASING.inOut);
	const px = 960 + (LEAN.px - 960) * lean;
	const py = 540 + (LEAN.py - 540) * lean;
	const s = 1 + (LEAN.s - 1) * lean;

	const startBlip = t >= 0.6 && t < 1.1;
	const pulse0 = c(0.9, 1.6, 0, 1, EASING.inOut);
	// The live ring holds through the whole read-and-think beat.
	const routerLive = t >= 1.5 && t < 7.0;
	const routerOk = t >= 7.0 && t < 9.6;

	// Reading the context…
	const ctxTagGlow = Math.min(c(3.0, 3.6), c(4.6, 5.0, 1, 0));
	// …then the model thinks (the held beat).
	const modelGlow = Math.min(c(4.6, 5.0), c(6.2, 6.6, 1, 0));

	// The verdict: Support's route row settles green; its port fires.
	const supportGlow = Math.min(c(6.2, 6.5), c(6.8, 7.1, 1, 0));
	const supportMatch = Math.min(c(6.6, 6.9), c(9.2, 9.8, 1, 0));
	const handleGlow = interpolate(t, [7.0, 7.3, 8.0, 8.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const edgeBHi = Math.min(c(7.2, 7.6), c(9.2, 9.8, 1, 0));
	const pulseB = c(7.2, 8.0, 0, 1, EASING.inOut);
	const destBLive = t >= 7.9 && t < 8.6;
	const destBOk = t >= 8.6 && t < 9.5;

	// The two routes not chosen dim the moment Support's port fires.
	const laneDim = Math.min(c(7.2, 7.8), c(9.3, 10.0, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Camera px={px} py={py} s={s}>
				<Fork
					phase={1}
					start={{highlighted: startBlip}}
					decider={{highlighted: routerLive, state: routerOk ? "ok" : "none"}}
					destA={{dim: laneDim}}
					destB={{highlighted: destBLive, state: destBOk ? "ok" : "none"}}
					destC={{dim: laneDim}}
					edgeA={{opacity: 1 - 0.65 * laneDim}}
					edgeB={{hi: edgeBHi}}
					edgeC={{opacity: 1 - 0.65 * laneDim}}
					branchB={{glow: supportGlow, match: supportMatch, handleGlow}}
					ctxTagGlow={ctxTagGlow}
					modelGlow={modelGlow}
					pulse0={pulse0}
					pulseB={pulseB}
				/>
			</Camera>
		</AbsoluteFill>
	);
};
