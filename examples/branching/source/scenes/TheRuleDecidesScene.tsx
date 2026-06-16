import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {LEAN} from "../layout";
import {Camera, CanvasDots, Fork} from "./_fork";

// Scene 2 — the rule decides [run + lean-in + reference-resolution]. Run A:
// <start.priority> resolves to 'high' inside the If row (the docs' own
// literal — nothing invented) and the verdict lands ~0.3s later. Instant —
// no model, no think-hold. That speed is half of the video's wordless
// timing-contrast lesson (scene 5 holds). The camera stays leaned through
// the cut — the one deliberate cross-boundary carry in the video.
export const TheRuleDecidesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// Camera: identity → LEAN, then HOLD through the scene end (carried).
	const lean = c(1.4, 2.8, 0, 1, EASING.inOut);
	const px = 960 + (LEAN.px - 960) * lean;
	const py = 540 + (LEAN.py - 540) * lean;
	const s = 1 + (LEAN.s - 1) * lean;

	// The run.
	const startBlip = t >= 0.6 && t < 1.1;
	const pulse0 = c(0.9, 1.6, 0, 1, EASING.inOut);
	const deciderLive = t >= 1.5 && t < 4.8;
	const deciderOk = t >= 4.8 && t < 9.2;

	// If row: glow (checking) → tag resolves → green verdict 0.3s later.
	const ifGlow = Math.min(c(3.0, 3.4), c(4.4, 4.8, 1, 0));
	const ifTagGlow = Math.min(c(3.2, 3.6), c(4.0, 4.4, 1, 0));
	const ifResolve = Math.min(c(3.8, 4.2), c(8.8, 9.3, 1, 0));
	const ifMatch = Math.min(c(4.4, 4.7), c(8.8, 9.4, 1, 0));

	// else row was never checked — it dims when the verdict lands.
	const elseDim = Math.min(c(4.4, 4.8), c(8.8, 9.4, 1, 0));

	// The If port fires; the pulse rides the top edge; Escalate runs.
	const handleGlow = interpolate(t, [4.8, 5.1, 5.8, 6.2], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const edgeAHi = Math.min(c(5.0, 5.4), c(8.6, 9.2, 1, 0));
	const pulseA = c(5.0, 5.8, 0, 1, EASING.inOut);
	const destALive = t >= 5.7 && t < 6.5;
	const destAOk = t >= 6.5 && t < 9.0;

	// The lane not taken dims the moment the path commits, undims at revert.
	const laneDim = Math.min(c(4.9, 5.5), c(8.8, 9.5, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Camera px={px} py={py} s={s}>
				<Fork
					phase={0}
					start={{highlighted: startBlip}}
					decider={{highlighted: deciderLive, state: deciderOk ? "ok" : "none"}}
					destA={{highlighted: destALive, state: destAOk ? "ok" : "none"}}
					destB={{dim: laneDim}}
					edgeA={{hi: edgeAHi}}
					edgeB={{opacity: 1 - 0.65 * laneDim}}
					branchA={{glow: ifGlow, match: ifMatch, handleGlow}}
					branchB={{dim: elseDim}}
					ifTag={{glow: ifTagGlow, resolve: ifResolve}}
					pulse0={pulse0}
					pulseA={pulseA}
				/>
			</Camera>
		</AbsoluteFill>
	);
};
