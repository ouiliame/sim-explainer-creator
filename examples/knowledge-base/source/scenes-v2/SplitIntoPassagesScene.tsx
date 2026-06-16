import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, KbChain, KbPanel, QUESTION} from "./_shared";

// v2 scene 3 — split into passages. Same held moment, same panel. The
// documents glide to the panel's left column, and from each one two passage
// cards slide out and settle beside it. The originals stay — search will
// look through the pieces, not the files.
export const SplitIntoPassagesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const docSlide = interpolate(t, [0.6, 1.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const chunkReveal = (i: number, j: number) =>
		interpolate(t, [2.0 + i * 0.8 + j * 0.2, 2.5 + i * 0.8 + j * 0.2], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<KbChain
				start={{dim: 1}}
				knowledge={{highlighted: true}}
				agent={{dim: 1}}
				edge1={{opacity: 0.25}}
				edge2={{opacity: 0.25}}
				inputResolve={{text: QUESTION, mix: 1}}
			/>
			<KbPanel
				docSlide={docSlide}
				chunks={(i, j) => ({reveal: chunkReveal(i, j)})}
			/>
		</AbsoluteFill>
	);
};
