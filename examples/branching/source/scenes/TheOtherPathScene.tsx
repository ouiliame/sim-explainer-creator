import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {LEAN} from "../layout";
import {Camera, CanvasDots, Fork} from "./_fork";

// Scene 3 — the other path [run], inside the held lean-in framing. Run B:
// the If row glows FIRST (top-to-bottom order made visible) and dims — no
// match (the real payload is a pending artifact; the verdict choreography
// carries it without inventing a value) — then else brightens, settles
// green, and the bottom lane runs. Camera returns to identity before the
// scene ends.
export const TheOtherPathScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// Camera: held at LEAN, returning to identity at the end of the scene.
	const back = c(6.4, 7.7, 0, 1, EASING.inOut);
	const px = LEAN.px + (960 - LEAN.px) * back;
	const py = LEAN.py + (540 - LEAN.py) * back;
	const s = LEAN.s + (1 - LEAN.s) * back;

	const startBlip = t >= 0.4 && t < 0.9;
	const pulse0 = c(0.7, 1.4, 0, 1, EASING.inOut);
	const deciderLive = t >= 1.3 && t < 3.9;
	const deciderOk = t >= 3.9 && t < 6.4;

	// If is checked first… and doesn't match: glow → dim.
	const ifGlow = Math.min(c(1.7, 2.1), c(2.6, 2.9, 1, 0));
	const ifDim = Math.min(c(2.6, 3.0), c(5.8, 6.4, 1, 0));

	// The glow moves down; else matches.
	const elseGlow = Math.min(c(2.9, 3.3), c(3.6, 4.0, 1, 0));
	const elseMatch = Math.min(c(3.5, 3.8), c(5.8, 6.4, 1, 0));
	const handleGlow = interpolate(t, [3.9, 4.2, 4.9, 5.3], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const edgeBHi = Math.min(c(4.1, 4.5), c(5.8, 6.4, 1, 0));
	const pulseB = c(4.1, 4.9, 0, 1, EASING.inOut);
	const destBLive = t >= 4.8 && t < 5.5;
	const destBOk = t >= 5.5 && t < 6.2;

	// Escalate's lane dims the moment the else port fires.
	const laneDim = Math.min(c(4.0, 4.6), c(5.9, 6.6, 1, 0));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Camera px={px} py={py} s={s}>
				<Fork
					phase={0}
					start={{highlighted: startBlip}}
					decider={{highlighted: deciderLive, state: deciderOk ? "ok" : "none"}}
					destA={{dim: laneDim}}
					destB={{highlighted: destBLive, state: destBOk ? "ok" : "none"}}
					edgeA={{opacity: 1 - 0.65 * laneDim}}
					edgeB={{hi: edgeBHi}}
					branchA={{glow: ifGlow, dim: ifDim}}
					branchB={{glow: elseGlow, match: elseMatch, handleGlow}}
					pulse0={pulse0}
					pulseB={pulseB}
				/>
			</Camera>
		</AbsoluteFill>
	);
};
