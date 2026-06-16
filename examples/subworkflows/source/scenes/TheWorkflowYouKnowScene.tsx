import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {ChildChain} from "./_local";

// Scene 1 — the workflow you know. The series CLASSIFY chain assembles on
// the builder canvas (blocks stagger in, edges draw on — the docs preview's
// own entrance), then one COMPRESSED run: blips and pulses only, no row
// resolutions — scene 4 owns the values. Ends at rest.
// Beat intent: this is the workflow you already built — complete and
// working on its own.
export const TheWorkflowYouKnowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.45) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	const pulse = (t0: number, dur = 0.65) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<ChildChain
				start={{opacity: reveal(0.4), highlighted: t >= 2.8 && t < 3.3}}
				agent={{opacity: reveal(0.9), highlighted: t >= 3.65 && t < 4.35}}
				response={{opacity: reveal(1.4), highlighted: t >= 4.95 && t < 5.45}}
				edge1={{progress: reveal(0.85, 0.4)}}
				edge2={{progress: reveal(1.35, 0.4)}}
			/>
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse(3.05)} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse(4.35)} />
		</AbsoluteFill>
	);
};
