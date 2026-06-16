import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, Fork, morphCurves} from "./_fork";

// Scene 4 — swap the decider [morph-swap + smooth growth + 2→3 lanes]. One
// continuous phase-driven morph under a selection ring: Condition becomes
// the docs' three-route Router (header identity, branch labels, Context +
// Model + Billing rows growing at exact slot heights, destinations gliding
// into the triage lanes, Billing's edge drawing from the new third port).
// Edge anchors track the handle rows continuously — never a snap.
export const SwapTheDeciderScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const phase = interpolate(t, [1.2, 7.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Billing's edge draws on as its lane arrives (Fork fades it with the
	// lane; progress never runs backwards).
	const edgeCDraw = interpolate(morphCurves(phase).destCMix, [0.05, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const editing = t >= 0.6 && t < 8.4;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Fork
				phase={phase}
				decider={{highlighted: editing}}
				edgeC={{progress: edgeCDraw}}
			/>
		</AbsoluteFill>
	);
};
