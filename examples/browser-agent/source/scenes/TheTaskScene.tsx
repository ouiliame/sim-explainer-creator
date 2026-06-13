import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {Rig, wave} from "./_rig";

// Scene 1 — the task [assemble]. The docs-shaped chain assembles in
// preview order: Start {Input: Competitor} → Research (agent) → Response.
// The Messages tag glows once (it's a reference) and releases. A normal
// workflow — one agent, told to research whatever comes in.
export const TheTaskScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.5) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<Rig
				start={{opacity: reveal(0.4)}}
				agent={{opacity: reveal(1.7)}}
				response={{opacity: reveal(3.1)}}
				edge1={{progress: reveal(1.1, 0.55)}}
				edge2={{progress: reveal(2.5, 0.55)}}
				msgGlow={wave(t, 4.8, 6.4)}
			/>
		</AbsoluteFill>
	);
};
